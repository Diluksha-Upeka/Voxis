import os
import time
import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import pyttsx3
from dotenv import load_dotenv
from groq import Groq

# 1. Setup
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Initialize Mouth (TTS Engine)
engine = pyttsx3.init()
engine.setProperty('rate', 170)  # Speed (Words per minute)
engine.setProperty('volume', 1.0) # Volume (0.0 to 1.0)

# --- THE MODULES ---

def speak(text):
    """The Mouth: Converts text to audio"""
    print(f"🤖 AI: {text}")
    engine.say(text)
    engine.runAndWait()

def record_audio(duration=5, fs=44100):
    """The Ear: Listens to microphone"""
    print("\n🎤 Listening... (Speak now!)")
    
    # Beep to signal start (Optional visual cue)
    print("🔴 REC")
    
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
    sd.wait()
    
    print("✅ Processing...")
    wav.write("input.wav", fs, recording)

def transcribe_audio(filename="input.wav"):
    """The Translator: Audio -> Text"""
    with open(filename, "rb") as file:
        transcription = client.audio.transcriptions.create(
            file=(filename, file.read()),
            model="whisper-large-v3", # The fast model
            response_format="json",
            language="en"
        )
    return transcription.text

def think(messages):
    """The Brain: Text -> Smart Answer"""
    completion = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=messages,
        temperature=0.5,
        max_tokens=200,
    )
    return completion.choices[0].message.content

# --- THE MAIN LOOP ---

def run_jarvis():
    # Intro
    speak("System online. I am listening.")
    
    # Initialize conversation history
    messages = [
        {
            "role": "system", 
            "content": "You are Jarvis, a highly intelligent voice assistant. Keep answers extremely brief (1-2 sentences max) and conversational."
        }
    ]
    
    while True:
        try:
            # 1. Listen
            record_audio(duration=4) # 4 seconds is a good conversational window
            
            # 2. Transcribe
            user_text = transcribe_audio()
            
            # Check for silence or empty audio
            if not user_text.strip():
                print("... (Silence) ...")
                continue
                
            print(f"🗣️ User: {user_text}")
            
            # 3. Exit Command
            if "goodbye" in user_text.lower() or "exit" in user_text.lower():
                speak("Shutting down. Goodbye.")
                break
            
            # 4. Add user message to history
            messages.append({"role": "user", "content": user_text})
            
            # 5. Think
            response = think(messages)
            
            # 6. Add assistant response to history
            messages.append({"role": "assistant", "content": response})
            
            # 7. Speak
            speak(response)
            
            # Small pause so it doesn't listen to itself echoing
            time.sleep(1)
            
        except KeyboardInterrupt:
            print("\n🛑 Force Stop")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            break

if __name__ == "__main__":
    run_jarvis()