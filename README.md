# VICE CITY Cheat Companion — iPhone PWA

Eine installierbare Progressive Web App (PWA), die auf dem iPhone in Safari geöffnet und zum Home-Bildschirm hinzugefügt werden kann.

## Funktionen
- Responsive iPhone-Oberfläche im Neon-/Vice-City-inspirierten Stil
- Cheat-Suche und Filter nach Plattform/Kategorie
- Favoriten, eigene Einträge, Löschen und Kopieren
- Lokale Speicherung im Browser
- JSON-Export und -Import
- Service Worker für Offline-Nutzung nach dem ersten Laden

## Auf dem iPhone installieren
Die Dateien müssen zuerst über eine HTTPS-Adresse veröffentlicht werden. Danach:
1. Website in Safari öffnen.
2. Teilen-Symbol antippen.
3. „Zum Home-Bildschirm“ auswählen.
4. „Als Web-App öffnen“ aktivieren, falls angezeigt.
5. „Hinzufügen“ antippen.

Wichtig: Ein einfacher lokaler Datei-Aufruf (`file://`) reicht nicht für Service Worker und PWA-Installation. Die App muss über HTTPS oder localhost bereitgestellt werden.

## Hosting ohne Mac
Du kannst die Dateien über einen GitHub-Account in ein Repository hochladen und GitHub Pages aktivieren. Das lässt sich im Browser auch auf dem iPhone erledigen, ist auf dem kleinen Bildschirm aber etwas umständlicher. Alternativ einen HTTPS-Static-Hosting-Dienst verwenden.

## Datenschutz und Grenzen
- Die Daten liegen lokal im Browser auf diesem Gerät. Browserdaten löschen oder die Web-App entfernen kann lokale Daten löschen. Exportiere regelmäßig eine JSON-Sicherung.
- Offline-Funktion greift nach dem ersten erfolgreichen Laden und Caching.
- iOS verwaltet Web-Apps anders als native Apps; Hintergrundverhalten und Clipboard können je nach iOS-Version variieren.
- Keine offizielle Verbindung zu Rockstar Games oder GTA VI.
- Keine bestätigten offiziellen GTA-VI-Cheat-Codes vorinstalliert; die App erfindet keine.
- Dies ist keine native IPA und benötigt keinen App-Store-Installationsprozess.
