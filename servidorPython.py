import socketio
import eventlet
import eventlet.wsgi
import math
from flask import Flask, render_template

sio = socketio.Server()
app = Flask(__name__)

@app.route('/')
def index():
    """Serve the client-side application."""
    return render_template('index.html')

@sio.on('connect', namespace='/chat')
def connect(sid, environ):
    print("connect ", sid)
    area(n, w, prof);

@sio.on('disconnect', namespace='/chat')
def disconnect(sid):
    print('disconnect ', sid)
    
@sio.on('alturaFinal')
def calculoAlturaFinal(sid, n, alturaInicial, dt, a, qi, qo):
    alturaFinal(int(n), float(alturaInicial), float(dt), float(a), float(qi), float(qo))
    
@sio.on('qo')
def calculoQo(sid, n, cv, alt):
    Qo(int(n), float(cv), float(alt))
    #print('recebido qo')
    
def alturaFinal(n, alturaInicial, dt, a, qi, qo):
    alt = alturaInicial + ((dt/a) * (qi - qo))
    sio.emit('respostaAlturaFinal', data=(n,alt))
    
def Qo(n, cv, alt):
    qo = cv*(math.sqrt(alt))
    sio.emit('respostaQo', data=(n,qo))
    
if __name__ == '__main__':
    app = socketio.Middleware(sio, app)
    eventlet.wsgi.server(eventlet.listen(('', 2003)), app)
