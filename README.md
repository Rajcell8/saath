# Saath

A voice-first helper for Indian families handling paperwork after a death.
Speak in English, Hindi or Bengali; Saath asks a few yes/no questions, builds a
personal checklist and reads out one step at a time.

## Run (one command)

    docker compose up --build

Open http://localhost:8080 in Chrome or Edge and allow the microphone.

- No API keys or secrets are needed. Speech recognition and speech output use
  the browser's built-in Web Speech API.
- Microphone access needs localhost or HTTPS (GitHub Pages works).
- If the browser has no speech support, the buttons still run the whole flow.

## Voice commands

Language: "English", "Hindi", "Bangla". Questions: yes / no (haan, nahi, hyan, na).
Steps: next, repeat, back, slower (also in Hindi and Bengali).

## Notes

Guidance is general sample content for a prototype. Confirm real requirements
with the office.
