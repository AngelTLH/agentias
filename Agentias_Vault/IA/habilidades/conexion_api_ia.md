# Habilidad: Conexión a APIs de IA e Integración Conversacional

Esta habilidad define las pautas técnicas, arquitecturas de backend y código de referencia para conectar aplicaciones locales a proveedores de modelos de lenguaje de frontera (Google Gemini, OpenAI, etc.) e implementar interfaces de chat interactivas en dashboards y páginas web.

---

## 1. Configuración de API y Seguridad

### Buenas Prácticas de Credenciales
* **Nunca insertar API Keys directamente en el código**. Utilizar variables de entorno o archivos de configuración local `.env` (asegurando agregarlos al `.gitignore`).
* **Carga de variables**:
  * **Python**: Usar la librería `python-dotenv` para cargar credenciales:
    ```python
    import os
    from dotenv import load_dotenv
    load_dotenv()
    gemini_key = os.getenv("GEMINI_API_KEY")
    ```
  * **Node.js**: Usar `dotenv`:
    ```javascript
    require('dotenv').config();
    const geminiKey = process.env.GEMINI_API_KEY;
    ```

---

## 2. Conexión a Proveedores de IA (Ejemplos Base)

### A. Google Gemini API (Python)
Para utilizar la API de Gemini, configurar el cliente oficial `google-generativeai`:

```python
import google.generativeai as genai

# Configurar API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Definir configuración del modelo y system instruction
generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "max_output_tokens": 2048,
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction="Actúas como un experto especializado para este proyecto. Tu objetivo es ayudar al usuario basándote en el manual de expertiz del área."
)

# Iniciar chat con memoria integrada
chat = model.start_chat(history=[])
response = chat.send_message("Hola, ¿cuáles son las directrices de hoy?")
print(response.text)
```

### B. OpenAI API (Python)
Para conectar con ChatGPT mediante la librería oficial `openai` (v1.0.0+):

```python
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# El historial debe manejarse de forma explícita en una lista de mensajes
messages = [
    {"role": "system", "content": "Eres un asistente experto para este proyecto."},
    {"role": "user", "content": "Hola, ¿cómo estás?"}
]

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    temperature=0.7
)

assistant_response = response.choices[0].message.content
print(assistant_response)
```

---

## 3. Gestión de Estado y Memoria Conversacional

Para que la conversación sea interactiva y coherente, el sistema debe almacenar el historial de mensajes por sesión:

### Estructura de Datos Recomendada (Memoria de Sesión)
```json
{
  "session_id_xyz": [
    {"role": "user", "content": "Pregunta inicial del usuario..."},
    {"role": "model", "content": "Respuesta estructurada del agente..."},
    {"role": "user", "content": "Pregunta de seguimiento..."}
  ]
}
```

* **Persistencia**: Para aplicaciones ligeras o de desarrollo, usar una estructura en memoria (diccionario global de Python o Map de JS). Para entornos de producción, almacenar en una base de datos clave-valor como **Redis** o base de datos relacional (SQLite/PostgreSQL).
* **Control de Contexto (Truncamiento)**: Limitar el historial a los últimos $N$ mensajes (ej. últimos 10-20 mensajes) para no exceder los límites de tokens de la ventana de contexto y mantener costos de API optimizados.

---

## 4. Implementación en Interfaces de Usuario

### A. Dashboard Interactivo en Dash (Python)
Para crear un chat interactivo dentro de un dashboard de Dash usando componentes básicos de HTML y dcc:

```python
import dash
from dash import html, dcc, Input, Output, State
import google.generativeai as genai

app = dash.Dash(__name__)

# Configuración básica de Gemini
genai.configure(api_key="TU_GEMINI_API_KEY")
model = genai.GenerativeModel("gemini-1.5-flash", system_instruction="Eres un asesor experto del Dashboard.")
chat_session = model.start_chat(history=[])

app.layout = html.Div([
    html.H2("Chat del Proyecto con IA"),
    html.Div(id="chat-history-container", style={"height": "300px", "overflowY": "scroll", "border": "1px solid #ccc", "padding": "10px"}),
    dcc.Input(id="user-input", type="text", placeholder="Escribe tu consulta aquí...", style={"width": "80%"}),
    html.Button("Enviar", id="send-btn", n_clicks=0)
])

@app.callback(
    Output("chat-history-container", "children"),
    Input("send-btn", "n_clicks"),
    State("user-input", "value"),
    State("chat-history-container", "children"),
    prevent_initial_call=True
)
def update_chat(n_clicks, user_message, chat_history):
    if not user_message:
        return chat_history
    
    if chat_history is None:
        chat_history = []
        
    # Enviar mensaje a la API
    response = chat_session.send_message(user_message)
    
    # Agregar mensajes visualmente
    chat_history.append(html.P(f"Usuario: {user_message}", style={"fontWeight": "bold"}))
    chat_history.append(html.P(f"Agente: {response.text}", style={"backgroundColor": "#f0f0f0", "padding": "5px"}))
    
    return chat_history
```

### B. Widget de Chat en Página Web (HTML + CSS + JS)
Para agregar una conversación flotante o integrada en una web estática:

#### HTML (`index.html`)
```html
<div class="chat-widget">
    <div class="chat-header">Conversa con tu Agente IA</div>
    <div id="chat-messages" class="chat-messages"></div>
    <div class="chat-input-area">
        <input type="text" id="chat-input" placeholder="Escribe tu consulta..." />
        <button id="send-chat-btn">Enviar</button>
    </div>
</div>
```

#### CSS (`style.css`)
```css
.chat-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    height: 450px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.3);
    display: flex;
    flex-direction: column;
}
.chat-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px;
    font-weight: 600;
    border-radius: 12px 12px 0 0;
}
.chat-messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    font-size: 0.9rem;
}
.chat-input-area {
    display: flex;
    padding: 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.chat-input-area input {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 8px;
}
.chat-input-area button {
    margin-left: 8px;
    background: #764ba2;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
}
```

#### Javascript (`app.js` enviando consulta a un backend local `/api/chat`)
```javascript
const sendBtn = document.getElementById('send-chat-btn');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    // Renderizar mensaje del usuario
    appendMessage('user', text);
    chatInput.value = '';
    
    // Llamada API a nuestro servidor local
    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    })
    .then(res => res.json())
    .then(data => {
        appendMessage('agent', data.reply);
    })
    .catch(err => {
        appendMessage('agent', 'Error de conexión con el agente: ' + err.message);
    });
}

function appendMessage(sender, content) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.style.margin = '8px 0';
    msgDiv.style.padding = '8px';
    msgDiv.style.borderRadius = '6px';
    if (sender === 'user') {
        msgDiv.style.backgroundColor = '#e2e8f0';
        msgDiv.style.textAlign = 'right';
    } else {
        msgDiv.style.backgroundColor = '#f3e8ff';
        msgDiv.style.textAlign = 'left';
    }
    msgDiv.textContent = content;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
```
