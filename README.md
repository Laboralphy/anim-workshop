# anim-workshop
Un logiciel de création d'animation à partir de capture webcam.

# Auteur
Raphaël Marandet (raphael.marandet@gmail.com)
Dépot GIT : github.com/Laboralphy/anim-workshop.git


# A quoi sert ce logiciel ?
Ce logiciel permet de créer de petits films d'animation par concaténéation d'images capturées 
à partir de la webcam.

# Dépendances
- ffmpeg ou avconv
- ssh


# Comment faire un film ?

1) Lorsque la webcam filme, on peut __capturer des images__ en cliquant sur l'icône ressemblant à un 
appareil photo. On peut également appuyer sur la barre espace.
2) On peut à tout moment __nommer le projet__ (icone crayon). Cela permet de pouvoir le __sauvegarder__ 
(icone disquette)
3) Au fur et à mesure de la capture, les images s'accumulent dans l'__album__ (partie droite de l'écran).
Cet album propose des opération basique de gestion (sélection, suppression...)
4) Sous l'album se trouve un outil pour __ajouter de la musique__. On sélectionne un fichier musical (que l'on peut changer à tout moment).
La msique est automatiquement ajoutée à la video dans le rendu final.
5) L'icone du clapet permet de __créer le film__. Dans ce cas le nom du projet est utilisé pour créer le fichier.
6) Un outil d'__upload de video__ est disponible (voir la section correspondante)   

# Actions

## Ecran de démarrage
L'écran de démarrage s'affiche, avec le nom de l'auteur et le numéro de version

## Nouveau projet
Réinitialisation complète du logiciel afinde démarrer un nouveau projet. 
- Le dossier snapshot se vide
- La webcam se met à filmer
- Le champs "nom du projet" se mets à vide.

## Renommer le projet
Changer le nom du projet changera également le répertoire de sauvegarde ainsi qu ele nom
de la video uploadée.

## Ouvrir un projet
Affiche une liste des projets précédemment sauvegardée. L'ouverture d'un projet entraine la perte
de toute modification non sauvegardée du projet précédent.

## Création du film
Créé le fichier video à partir des images collectées dans l'album.

## Transmission du film
Transmet le film à un serveur distant dont les information de connexion sont stockée dans 
le fichier de configuration ~/.anim-workshop/config.json à la rubrique "upload".