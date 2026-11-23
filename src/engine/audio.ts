import * as Tone from 'tone'

// Ses durumunun tek tanımı
export type AudioStatus = 'idle' | 'starting' | 'ready' | 'error'

// ── Modülün kendi durumu (dışarı export edilmez) ──
// 1) Şu anki durum, 'idle' ile başlar
let status: AudioStatus = 'idle'

// 2) Süren başlatmanın Promise'i: başlatma yoksa null
let pending: Promise<AudioStatus> | null = null
// 3) Dinleyicilerin listesi (Set kullanmak işini kolaylaştırır)
const listeners: Set<(s: AudioStatus) => void> = new Set()
// Durumu değiştirir ve bütün dinleyicilere haber verir.
// Export edilmez: durum sadece bu dosyanın içinden değişir.
function setStatus(next: AudioStatus): void {
    status = next;
    console.log("Audio status changed to:", next);
    listeners.forEach((listener) => listener(status));
    
}

// E01: Tarayıcı Web Audio destekliyor mu?
export function isWebAudioSupported(): boolean {
  if ('AudioContext' in window || 'webkitAudioContext' in window) {
   return true;
  } else {
   return false;
  }
  
}

// Anlık durumu döner
export function getAudioStatus(): AudioStatus {
  return status
}

// Durum değişince listener çağrılır.
// Dönen fonksiyon çağrılınca abonelik iptal olur.
export function onAudioStatusChange(listener: (s: AudioStatus) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
async function doStart(): Promise<AudioStatus> {
    setStatus('starting');
    try {
        await Tone.start();
        if (Tone.getContext().state === 'running') {
            setStatus('ready');
            return 'ready';
        } else {
            setStatus('error');
            return 'error';
        }
    } catch (error) {
        console.error("Error starting audio:", error);
        setStatus('error');
        return 'error';
    } finally {
        pending = null;
    }
}
// CU0.1: sesi başlatır. Sadece bir click handler'ın içinden çağrılmalı.
export async function startAudio(): Promise<AudioStatus> {
  // a) Destek yoksa  → durum 'error' (E01), dön
    if (!isWebAudioSupported()) {
        setStatus('error');
        return 'error';
    }
  // b) Zaten 'ready'     → hiçbir şey yapma, dön
    if (status === 'ready') {  
        return 'ready';
    }
  // c) Zaten 'starting'  → süren başlatmanın sonucunu bekle, dön
    if (pending) {
        return pending;
    }
    pending = doStart();
    return pending
}