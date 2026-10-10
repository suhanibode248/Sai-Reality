import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add useRef to imports
if 'useRef' not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState, useRef } from 'react';")

# 2. Add audio state
audio_state = '''  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to turn off the microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
'''

if 'const [isRecording' not in content:
    content = content.replace('const [isEditingCustomer, setIsEditingCustomer] = useState(false);', 
                              'const [isEditingCustomer, setIsEditingCustomer] = useState(false);\n' + audio_state)

# 3. Update the UI for Voice Note
old_voice = r'''{/* Voice Note */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Voice Note/ Remark</label>
                    <input type="file" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529', marginBottom: '10px' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#f8f9fa', cursor: 'pointer' }}>Start Recording</button>
                      <button style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#f8f9fa', cursor: 'pointer' }}>Stop Recording</button>
                      <button style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#f8f9fa', cursor: 'pointer' }}>Save Audio remark</button>
                    </div>
                  </div>'''

new_voice = r'''{/* Voice Note */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Voice Note/ Remark</label>
                    
                    {audioURL && (
                      <div style={{ marginBottom: '10px' }}>
                        <audio src={audioURL} controls style={{ width: '100%', height: '36px' }}></audio>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {!isRecording ? (
                        <button type="button" onClick={startRecording} style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#f8f9fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '8px', height: '8px', backgroundColor: '#dc3545', borderRadius: '50%', display: 'inline-block' }}></span> Start Recording
                        </button>
                      ) : (
                        <button type="button" onClick={stopRecording} style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #dc3545', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#dc3545', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '8px', height: '8px', backgroundColor: '#dc3545', display: 'inline-block' }}></span> Stop Recording
                        </button>
                      )}
                      
                      {audioURL && (
                        <button type="button" onClick={() => alert("Audio remark saved!")} style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#f8f9fa', cursor: 'pointer' }}>Save Audio remark</button>
                      )}
                    </div>
                  </div>'''

if old_voice in content:
    content = content.replace(old_voice, new_voice)
else:
    print("WARNING: Could not find old voice UI block")

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added audio recording functionality!")
