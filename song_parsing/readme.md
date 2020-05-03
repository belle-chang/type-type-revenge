# Song Parsing for Type Type Revenge

The Java script takes in a MIDI file and creates a text file with each note's onset information on a new line (time in milliseconds from the start of the song, note, and velocity separated by spaces). The Python script takes in a text file in the aforementioned format and creates a JSON file formatted as such:

```JSON
{
  "notes": [
    {
      "time": "197",
      "note": "55",
      "velocity": "111"
    },
    {
      "time": "134",
      "note": "84",
      "velocity": "111"
    }
  ]
}
```

## Usage

To run MidiSource.java from the terminal:

```bash
javac MidiSource.java
java MidiSource -p song.mid
```

This will create a txt file with the same name as the given MIDI file. Note that the '-p' is optional and will play the song if included.

The run textToJson.py from the terminal:

```bash
python3 textToJson.py song.txt
```

This will create a JSON file with the same name as the given txt file.
