# Notes explicatives
Etudiante : Audrey Fillettaz
Cours : Visualisation de données
Professeur : Loris Rimaz
Semestre : Printemps 2026

1. Titre du travail 
Le titre de mon travail est "Films distribués en Suisse de 2000 à 2025 par pays d’origine : une visualisation"

2. Description du processus d’obtention des données 
Les données ont été obtenues sur le site de l’office fédéral de la statistique (lien : https://www.bfs.admin.ch/bfs/fr/home/statistiques/culture-medias-societe-information-sport/culture/film-cinema.assetdetail.36476428.html, titre : Offre cinématographique et demande selon le pays d'origine).
Elles ont été téléchargées au format JSON, format particulièrement adapté à la diffusion de données statistiques mais qui nécessite un pré-traitement afin de pouvoir être exploité dans une visualisation D3.js (voir le point 4).

3. Présentation des données
Les données sont composées du nombre de films exploités en Suisse dans les cinémas par année (de 2020 à 2025) et par pays d'origine du film. 
Après traitement, le jeu de données contient 26 années, 99 pays soit un total de 2'574 observations en tout qui contiennent chacune trois variables (année, pays d'origine et nombre de films distribués).

4. Explication des étapes de pré-traitement des données 
Le fichier fourni par l'OFS est au format JSON. Les valeurs sont stockées dans un tableau unidimensionnel et ont dû être associées correctement aux dimensions "année" et "pays d'origine".
Un script JavaScript a été exécuté avec Node.js afin d'effectuer les points suivants :
- Lire le fichier JSON
- Reconstruire les observations individuelles
- Supprimer les catégories agrégéees 
- Nettoyer le nom des pays
- Générer un nouveau fichier directement exploitable par D3.js intitulé data-simple.json
Ce fichier final a simplifié la manipulation suivante des données et contenait toutes les observations sous la forme suivante :

{ 
"annee": XXXX, 
"pays": "XXXXX", 
"films": XX 
}

5. Explication de la visualisation produite
La visualisation proposée consiste en une visualisation interactive sous la forme de bulles. Chaque bulle représente un pays d'origine. La taille de la bulle est proportionnelle au nombre de films distribués en Suisse durant l'année qui a été sélectionnée.
L'utilisateur peut choisir l'année qui est présentée grâce à un curseur horizontal en haut de la visualisation. A chaque changement d'année, les bulles sont réadaptées et mises à jour.
Les pays ont été regroupés par continent.
Les pays avec le plus de films distribués ont leur nom directement écrit dans la bulle. Pour les autres, afin de ne pas surcharger la visualisation et la rendre lisible rapidement, une bulle apparaît lorsque le curseur se met sur la bulle et indique les informations suivantes : le nom du pays, le continent, le nombre de films distribués et l'année sélectionnée.

Le but d'un diagramme à bulles était de rendre lisible rapidement les pays les plus représentés sur le marché du film suisse tout en conservant une représentation de l'ensemble des pays, y compris ceux qui n'ont qu'un seul film. L'intérêt aussi de ne pas afficher tous les noms des pays est d'inciter l'utilisateur à interagir avec la visualisation. 

La mise en forme (couleurs, occupation de l'espace) a volontairement été laissée neutre afin de ne pas ajouter des éléments qui perturberaient la compréhension. 

L'intérêt est de pouvoir comparer les pays entre eux mais également au cours du temps à l'aide du curseur temporel et de se rendre compte de la représentation des différentes cultures dans les films qui passent sur les écrans de cinéma en Suisse. Le fait d'avoir regroupé les pays par continent permet de se rendre compte des différences de représentation entre ceux-ci. 

6. Déclaration d'utilisation d'IA générative
Une IA générative a été utilisée en tant que support pour coder la visualisation.
Il est difficile de déterminer quelles lignes de codes exactement ont été élaborées par une IA : un processus itératif ayant été mis en place. L'IA a principalement servi à proposer des manières de coder selon le résultat désiré et à résoudre des problèmes. Tous les extraits de code proposés par l'IA ont été testés, adaptés et finalement intégrés au projet après vérification.
Par contre, l'IA n'a pas été utilisée pour la conception du projet, les choix de visualisation, la sélection des données ainsi que leur interprétation.