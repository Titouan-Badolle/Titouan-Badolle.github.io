@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo Dossier : %CD%
git status
git add .
git commit -m "Remplace videos par PDFs comptes rendus, nettoyage dossiers inutiles, SAE4 ajoutee"
git push origin main
echo.
echo Termine ! Appuie sur une touche pour fermer.
pause
