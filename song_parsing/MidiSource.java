
/******************************************************************************
 *  Compilation:  javac MidiSource.java
 *  Execution:    java MidiSource  [play] [filename.mid]
 *
 *  MIDI (Musical Instrument Digital Interface) Library. A MidiSource object
 *  produces MIDI messages, where the source can be hardware MIDI controller 
 *  keyboard or a MIDI file.   Generating MIDI messages from a MIDI
 *  file uses the default Java MIDI Sequencer, so that MIDI messages are 
 *  scheduled appropriately. 
 * 
 *  To test a MIDI file:
 *     java MidiSource [-p] filename.mid
 *  where the optional argument:
 *     -p -  indicates that the default JavaMIDI Synthesizer will 
 *           be used to play notes
 *  and the argument:
 *     filename - name of MID file
 *
 *  This will create a txt file in the same directory with the same name as the 
 *  midi file (i.e. song.mid will create a song.txt file). The txt file will have
 *  a line for each note on message, with the following format:
 *  time note velocity 
 *  (where time is the milliseconds from the start of the song)
 ******************************************************************************/

// Imports for parsing
import javax.sound.midi.*;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.LinkedList;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.HashMap;
import java.time.*;

// imports for writing to file
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

/*
 *
 *  @author Nico Toy
 *  @author Alan Kaplan
 *  @author Christy Lee
 */

public final class MidiSource {

    // queue for midi messages- produced by MIDI transmitter (keyboard controller or
    // sequencer)
    private LinkedList<MidiMessage> midiMessageQueue;
    private Sequencer sequencer; // Java MIDI sequencer

    private boolean playSynth = false; // indicates if MidiSource should play notes using
                                       // default Java Synthesizer as messages are
                                       // produced

    // MetaMessage event code for end of track
    private static final int MIDI_END_OF_TRACK = 47;

    // keep track of time
    private Clock clock = Clock.systemDefaultZone();
    private long initial = clock.millis();

    // text writer for output
    FileWriter outputWriter;

    // Private helper class that receives MidiMessages, and
    // adds each MIDI message received to a MidiSource queue. Optionally
    // prints messages to stdout
    private class MidiFileReceiver implements Receiver {

        public MidiFileReceiver() {
            midiMessageQueue = new LinkedList<MidiMessage>();
        }

        @Override
        // Invoked each time Receiver gets a MidiMessage
        public void send(MidiMessage message, long timeStamp) {
            // add the message to the queue
            midiMessageQueue.add(message);
            long time = clock.millis() - initial;

            if (message instanceof ShortMessage) {
                ShortMessage shortMessage = (ShortMessage) message;
                if (shortMessage.getCommand() == ShortMessage.NOTE_ON) {
                    // only write notes to txt file when it's the onset
                    writeToFile(time, shortMessage.getData1(), shortMessage.getData2());
                }
            }

        }

        // close the Receiver stream
        public void close() {
            midiMessageQueue = null;
        }

    }

    /**
     * Start playback of MIDI messages from time-stamped MIDI file, where each each
     * message is buffered and becomes available for consumption by the client once
     * it is "played" from the file
     * 
     * @param filename       the name of the file to play from
     * @param connectToSynth true if Sequencer should connect to Sequencer
     * @throws RuntimeException if the file is not found or not a valid MIDI file,
     *                          or if reading from the file failed
     */
    public MidiSource(String filename, boolean connectToSynth) {

        playSynth = connectToSynth;
        try {
            sequencer = MidiSystem.getSequencer(connectToSynth);
        } catch (MidiUnavailableException e) {
            e.printStackTrace();
        }

        FileInputStream fileInputStream;
        try {
            fileInputStream = new FileInputStream(filename);
        } catch (FileNotFoundException e) {
            throw new RuntimeException("File not found");
        }

        // connect file to sequencer
        try {
            sequencer.setSequence(fileInputStream);
            sequencer.getTransmitter().setReceiver(new MidiFileReceiver());
        } catch (IOException e) {
            throw new RuntimeException("Error reading file: " + filename);
        } catch (InvalidMidiDataException e) {
            throw new RuntimeException("Invalid MIDI file: " + filename);
        } catch (MidiUnavailableException e) {
            throw new RuntimeException("MIDI unavailable: " + filename);
        }

        // create output file and file writer
        File output;
        try {
            output = new File(filename.substring(0, filename.length() - 4) + ".txt");
            System.out.println(output);
            if (output.createNewFile()) {
                System.out.println("File created: " + output.getName());
            } else {
                System.out.println("File with output name already exists. Please retry.");
            }
        } catch (IOException e) {
            System.out.println("An error occurred creating output file.");
            e.printStackTrace();
        }

        try {
            outputWriter = new FileWriter(filename.substring(0, filename.length() - 4) + ".txt");
        } catch (IOException e) {
            System.out.println("An error occurred while creating/ writing to the file.");
            e.printStackTrace();
        }

        try {
            // Add a listener for meta message events
            sequencer.addMetaEventListener(new MetaEventListener() {
                public void meta(MetaMessage event) {
                    // close the Sequencer when done
                    if (event.getType() == MIDI_END_OF_TRACK) {
                        // Sequencer is done playing
                        close();
                        try {
                            outputWriter.close();
                        } catch (IOException e) {
                            System.out.println("An error occurred while closing the output writer.");
                            e.printStackTrace();
                        }
                    }
                }
            });
            sequencer.open();
        } catch (MidiUnavailableException e) {
            e.printStackTrace();
        }

    }

    public void start() {
        sequencer.start();
    }

    /**
     * Return whether there are new MIDI messages available.
     *
     * @return true if and only if there are new messages available to consume
     */
    public boolean isEmpty() {
        return midiMessageQueue.size() == 0;
    }

    /**
     * Return the next available short MIDI message (in FIFO order). All messages,
     * including the short MIDI message are "consumed", i.e., it will no longer be
     * available after this call. Returns null if queue is empty.
     *
     * @return The next available {@link MidiMessage}
     */
    public ShortMessage getMidiMessage() {
        while (!this.isEmpty()) {
            System.out.println("NOT EMPTY");
            System.out.println(midiMessageQueue.size());
            MidiMessage message = midiMessageQueue.remove();
            if (message instanceof ShortMessage)
                return (ShortMessage) midiMessageQueue.remove();
            // ignore other messages
        }
        return null; // if empty
    }

    public int nextKeyPressed() {
        ShortMessage message = getMidiMessage();
        if (message == null)
            return -1;
        else if (message.getCommand() == ShortMessage.NOTE_ON)
            return message.getData1();
        else
            return -1;
    }

    /**
     * Either stop listening for input from the device or stop playback from the
     * MIDI file.
     */
    public void close() {
        sequencer.stop();
        sequencer.close();
    }

    /**
     * Return whether this MidiSource is still active
     *
     * @return if listening from device, true if and only if this instance is still
     *         listening; if using from file, true if and only if the playback is
     *         still active
     */
    public boolean isActive() {
        return sequencer.isRunning();
    }

    public void writeToFile(long time, int note, int velocity) {
        try {
            outputWriter.write(time + " " + note + " " + velocity + "\n");
            outputWriter.flush();
        } catch (IOException e) {
            System.out.println("An error occurred while writing to the file.");
            e.printStackTrace();
        }
    }

    /**
     * Start listening for MIDI messages from the first MIDI input device found
     * (arbitrary if there are several), and print contents of each new message.
     * Extra details appear for instances of {@link ShortMessage}.
     */
    public static void main(String args[]) {
        String USAGE = "java MidiSource [-p] [<midifile.mid>]";
        String PLAY = "-p";
        MidiSource source = null;

        // make this receiver listen for input from first MIDI input device found
        if (args.length == 1) {
            source = new MidiSource(args[0], false);
            source.start();
        } else if (args.length == 2) {
            if (args[0].equals(PLAY)) { // java MidiSource -p somefile.mid
                source = new MidiSource(args[1], true);
                source.start();
            } else if (args[1].equals(PLAY)) { // java MidiSource somefile.mid -p
                source = new MidiSource(args[0], true);
                source.start();
            } else
                System.out.println(USAGE);
        } else
            System.out.println(USAGE);

    }
}
