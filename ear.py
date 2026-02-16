import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# 1. Setup Client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def record_audio(duration=5, fs=44100):
    print("Listening... (Speak now!)")
    
    # Record audio
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
    sd.wait()  # Wait until recording is finished
    
    print("Recording complete. Saving...")
    
    # Save as WAV file
    wav.write("input.wav", fs, recording)

def transcribe_audio(filename="input.wav"):
    print("Transcribing...")
    
    with open(filename, "rb") as file:
        # We use Groq's 'distil-whisper' model for speed
        transcription = client.audio.transcriptions.create(
            file=(filename, file.read()),
            model="whisper-large-v3",
            response_format="json",
            language="en",
            temperature=0.0
        )
    
    return transcription.text

if __name__ == "__main__":
    # Record 5 seconds of audio
    record_audio(duration=5)
    
    # Send to AI
    text = transcribe_audio()
    
    print("-" * 20)
    print(f" You said: {text}")
    print("-" * 20)
