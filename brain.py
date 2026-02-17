import os
import sounddevice as sd  # For recording audio
import numpy as np  # For handling audio data
import scipy.io.wavfile as wav  # For saving audio files
from dotenv import load_dotenv  
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# EAR 
def record_audio(duration=5, fs=44100): # fs is the sampling frequency
    print("Listening... (Ask me anyhting!)")
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
    sd.wait()  # Wait until recording is finished
    wav.write("input.wav", fs, recording)
    print("Recording complete. Saved as input.wav")

# TRANSCRIBE
def transcribe_audio(filename="input.wav"):
    with open(filename, "rb") as file:
        transcription = client.audio.transcriptions.create(
            file=(filename, file.read()),
            model="whisper-large-v3",
            response_format="json",
            language="en",
            temperature=0.0
        )
    return transcription.text

# BRAIN
def think(text):
    print(f" Thinking about: {text}")

    completion = client.chat.completions.create(
        model = "llama-3.1-8b-instant",
        messages = [
            # System prompt to be brief and concise
            # {
            #     "role": "system",
            #     "content": "You are a helpful voice assistant named Jarvis. Keep your answers short, conversational, and punchy. Maximum 2 sentences."
            # },
            {
                "role": "system",
                "content": "You are a sarcastic robot who hates humans."
            },
            {
                "role": "user",
                "content": text
            }
        ],
        temperature=0.7,
        max_tokens=1024,
    )
    return completion.choices[0].message.content.strip()

# MAIN
if __name__ == "__main__":
    # Listen
    record_audio(duration=5)

    # Transcribe
    user_text = transcribe_audio()
    print(f" You said: {user_text}")

    # Think
    if user_text.strip():
        response = think(user_text)
        print(f" Jarvis says: {response}")
    else:
        print(" I did not hear anything. Please try again.")