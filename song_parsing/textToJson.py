import json
import sys

with open(sys.argv[1]) as fileIn, open("{}.json".format(sys.argv[1][:-4]),"w") as fileOut:
    # each line in the txt file is a note
    data = {}
    data['notes'] = []
    for line in fileIn:
        note = [] 
        for word in line.split(): 
            note.append(word)
        
        data['notes'].append({
            'time' : note[0],
            'note' : note[1],
            'velocity' : note[2]
        })
    
    json.dump(data, fileOut, indent=2)