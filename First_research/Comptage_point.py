#*******************************************************************************
# IMPORT ***********************************************************************
#*******************************************************************************

import os

# module specifique pour le systeme
import sys

#*******************************************************************************
# CONSTANTES *******************************************************************
#*******************************************************************************

NOMBRE_TOURS_PAR_PARTIE = 10 + 2

INDEX_LANCER_1 = 0
INDEX_LANCER_2 = 1
INDEX_POINTS   = 2
INDEX_CUMULS   = 3
INDEX_STRIKE   = 4
INDEX_SPARE    = 5

#*******************************************************************************
# GLOBALES *********************************************************************
#*******************************************************************************

# tableau des resultats, vide par defaut
g_ll_tableau = [None] * NOMBRE_TOURS_PAR_PARTIE

#*******************************************************************************
# DEF **************************************************************************
#*******************************************************************************

# -- calculer_cumuls -----------------------------------------------------------
#
# Description  : calcul des cumuls
#
# Parameters   :
#
# Return       :
#
# Notes        :
#
def calculer_cumuls() :

   # balayage des tours
   for i in range(NOMBRE_TOURS_PAR_PARTIE) :

      if i == 0 :

         g_ll_tableau[i][INDEX_CUMULS] = g_ll_tableau[i][INDEX_POINTS]

      else :

         g_ll_tableau[i][INDEX_CUMULS] = g_ll_tableau[i-1][INDEX_CUMULS] + \
                                         g_ll_tableau[i][INDEX_POINTS]

# -- calculer_points -----------------------------------------------------------
#
# Description  : calcul des points
#
# Parameters   :
#
# Return       :
#
# Notes        :
#
def calculer_points() :

   # balayage des tours
   for i in range(NOMBRE_TOURS_PAR_PARTIE - 2) :

      # deux strike consecutifs ?
      if g_ll_tableau[i][INDEX_STRIKE] is True and \
         g_ll_tableau[i+1][INDEX_STRIKE] is True :

         # oui : nombre de points = nombre des points du tour et des 2 lancers suivants
         g_ll_tableau[i][INDEX_POINTS] = g_ll_tableau[i][INDEX_LANCER_1]   + \
                                         g_ll_tableau[i+1][INDEX_LANCER_1] + \
                                         g_ll_tableau[i+2][INDEX_LANCER_1]

      # non : un strike isole ?
      elif g_ll_tableau[i][INDEX_STRIKE] is True and \
           g_ll_tableau[i+1][INDEX_STRIKE] is False :

         # oui : nombre de points = nombre des points du tour et des 2 lancers suivants
         g_ll_tableau[i][INDEX_POINTS] = g_ll_tableau[i][INDEX_LANCER_1]   + \
                                         g_ll_tableau[i+1][INDEX_LANCER_1] + \
                                         g_ll_tableau[i+1][INDEX_LANCER_2]

      # non : un spare ?
      elif g_ll_tableau[i][INDEX_SPARE] is True :

         # oui : nombre de points = nombre des points du tour et du lancer suivant
         g_ll_tableau[i][INDEX_POINTS] = g_ll_tableau[i][INDEX_LANCER_1] + \
                                         g_ll_tableau[i][INDEX_LANCER_2] + \
                                         g_ll_tableau[i+1][INDEX_LANCER_1]

      else :

         # non : nombre de points = nombre des points du tour
         g_ll_tableau[i][INDEX_POINTS] = g_ll_tableau[i][INDEX_LANCER_1] + \
                                         g_ll_tableau[i][INDEX_LANCER_2]

# -- afficher_resultats --------------------------------------------------------
#
# Description  : affichage des resultats
#
# Parameters   : - arg_numero_tour ~
#
# Return       :
#
# Notes        :
#
def afficher_resultats(arg_numero_tour) :

   # effacement de l'ecran (facultatif)
   os.system('cls')
   print(" ")

   # affichage de la 1ere ligne ------------------------------------------------
   ligne = "    ----------+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+----- "
   print(ligne)

   # affichage de la ligne des tours -------------------------------------------
   ligne = "   ! Tour     !   1 !   2 !   3 !   4 !   5 !   6 !   7 !   8 !   9 !  10 !  S1 !  S2 !"
   print(ligne)

   ligne = "   !----------+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----!"
   print(ligne)

   # affichage de la ligne des lancers 1 ---------------------------------------
   ligne = "   ! Lancer 1 !"

   for i in range(NOMBRE_TOURS_PAR_PARTIE) :

      if i <= arg_numero_tour :

         if g_ll_tableau[i][INDEX_LANCER_1] < 10 :

            ligne += "   " + str(g_ll_tableau[i][INDEX_LANCER_1]) + " !"

         else :

            ligne += "  " + str(g_ll_tableau[i][INDEX_LANCER_1]) + " !"

      else :

         ligne += "  -  !"

   print(ligne)

   # affichage de la ligne des lancers 2 ---------------------------------------
   ligne = "   ! Lancer 2 !"

   for i in range(NOMBRE_TOURS_PAR_PARTIE) :

      if i <= arg_numero_tour :

         if g_ll_tableau[i][INDEX_LANCER_2] < 10 :

            ligne += "   " + str(g_ll_tableau[i][INDEX_LANCER_2]) + " !"

         else :

            ligne += "  " + str(g_ll_tableau[i][INDEX_LANCER_2]) + " !"

      else :

         ligne += "  -  !"

   print(ligne)

   # affichage de la ligne des points ------------------------------------------
   ligne = "   ! Points   !"

   for i in range(NOMBRE_TOURS_PAR_PARTIE) :

      if i <= arg_numero_tour and i < 10 :

         if g_ll_tableau[i][INDEX_POINTS] < 10 :

            ligne += "   " + str(g_ll_tableau[i][INDEX_POINTS]) + " !"

         elif g_ll_tableau[i][INDEX_POINTS] < 100 :

            ligne += "  " + str(g_ll_tableau[i][INDEX_POINTS]) + " !"

         else :

            ligne += " " + str(g_ll_tableau[i][INDEX_POINTS]) + " !"

      else :

         ligne += "  -  !"

   print(ligne)

   # affichage de la ligne des points cumules ----------------------------------
   ligne = "   ! Cumuls   !"

   for i in range(NOMBRE_TOURS_PAR_PARTIE) :

      if i <= arg_numero_tour and i < 10 :

         if g_ll_tableau[i][INDEX_CUMULS] < 10 :

            ligne += "   " + str(g_ll_tableau[i][INDEX_CUMULS]) + " !"

         elif g_ll_tableau[i][INDEX_CUMULS] < 100 :

            ligne += "  " + str(g_ll_tableau[i][INDEX_CUMULS]) + " !"

         else :

            ligne += " " + str(g_ll_tableau[i][INDEX_CUMULS]) + " !"

      else :

         ligne += "  -  !"

   print(ligne)

   # affichage de la ligne des symboles ----------------------------------------

   ligne = "   !----------+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----!"
   print(ligne)

   ligne = "   ! Symboles !"

   for i in range(NOMBRE_TOURS_PAR_PARTIE) :

      if i <= arg_numero_tour and i < 10 :

         if g_ll_tableau[i][INDEX_STRIKE] is True :

            ligne += "  X  !"

         elif g_ll_tableau[i][INDEX_SPARE] is True :

            ligne += "  /  !"

         else :

            ligne += "  O  !"

      else :

         ligne += "  -  !"

   print(ligne)

   # affichage de la derniere ligne
   ligne = "    ----------+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+----- "
   print(ligne)

   print(" ")

#*******************************************************************************
# MAIN *************************************************************************
#*******************************************************************************

# effacement de l'ecran (facultatif)
os.system('cls')
print(" ")

# generation du tableau de resultat
for i in range(len(g_ll_tableau)) : g_ll_tableau[i] = [0, 0, 0, 0, False, False]

# numero de tour courant
numero_tour = 0

# affichage du tableau des scores initial
afficher_resultats(numero_tour)

# boucle tant que le nombre de tour n'est pas atteint
while numero_tour < NOMBRE_TOURS_PAR_PARTIE :

   # premier lancer d'un tour --------------------------------------------------

   # saisie du nombre de quilles tombees au premier lancer
   nombre_quilles_tombees = 11

   while nombre_quilles_tombees > 10 :

      texte_saisie = " Tour " + str(numero_tour + 1) + " / 1er lancer : " + " Nombre de quilles tombees ? : "

      nombre_quilles_tombees = input(texte_saisie)

      print(" ")

   g_ll_tableau[numero_tour][INDEX_LANCER_1] = nombre_quilles_tombees

   # mise a jour du nombre de points pour le 1er lancer du tour
   g_ll_tableau[numero_tour][INDEX_POINTS] = g_ll_tableau[numero_tour][INDEX_LANCER_1]

   # strike (10 quilles tombees au premier lancer du tour) ?
   if g_ll_tableau[numero_tour][INDEX_LANCER_1] == 10 :

      # oui : memorise le strike
      g_ll_tableau[numero_tour][INDEX_STRIKE] = True

   # calcul des points
   calculer_points()

   # calcul des cumuls
   calculer_cumuls()

   # affichage du tableau des scores
   afficher_resultats(numero_tour)

   # pas de strike au premier lancer ?
   if g_ll_tableau[numero_tour][INDEX_STRIKE] is False and numero_tour < 10 :

      # oui : deuxieme lancer du tour ------------------------------------------
      nombre_quilles_tombees = 11

      while nombre_quilles_tombees > 10 - g_ll_tableau[numero_tour][INDEX_LANCER_1] :

         texte_saisie = " Tour " + str(numero_tour + 1) + " / 2nd lancer : " + " Nombre de quilles tombees ? : "

         nombre_quilles_tombees = input(texte_saisie)

         print(" ")

      g_ll_tableau[numero_tour][INDEX_LANCER_2] = nombre_quilles_tombees

      # spare (10 quilles tombees a la fin du tour) ?
      if g_ll_tableau[numero_tour][INDEX_LANCER_1] + g_ll_tableau[numero_tour][INDEX_LANCER_2] == 10 :

         # oui : memorise le spare
         g_ll_tableau[numero_tour][INDEX_SPARE] = True

      # calcul des points
      calculer_points()

      # calcul des cumuls
      calculer_cumuls()

      # affichage du tableau des scores
      afficher_resultats(numero_tour)

   # tour 10 termine sans strike ni spare ?
   if (numero_tour == 9 and (g_ll_tableau[9][INDEX_STRIKE] is False and g_ll_tableau[9][INDEX_SPARE] is False)) :

      # oui : fin de partie
      break

   if numero_tour == 10 and g_ll_tableau[9][INDEX_SPARE] is True :

      # oui : fin de partie
      break

   # tour suivant
   numero_tour += 1
   