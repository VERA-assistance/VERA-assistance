# ♿ VERA

[ ♿ ] > **VERA** est une application communautaire vous permettant de cartographier et d'évaluer l'accessibilité urbaine pour les personnes à mobilité réduite ;

[ 🔍 ] > Les contributions sont ouvertes à tous — signalez un obstacle, notez un lieu, ou proposez un itinéraire adapté directement depuis votre téléphone ;

[ 🗺️ ] > Les données sont intégrées en temps réel sur une carte interactive ;

[ ⚠️ ] > Projet en développement actif !


# VERA_assistance — Base de projet collaboratif

Application mobile de navigation accessible (type Waze pour personnes en situation de handicap).

---

## 📁 Structure des fichiers

```
VERA_assistance/
├── App.js                          ← Point d'entrée + gestion navigation
├── package.json
│
└── src/
    ├── theme/
    │   └── theme.js                ← 🎨 Couleurs, typo, espacements (TOUT ICI)
    │
    ├── components/
    │   ├── Header.js               ← En-tête (logo + bouton profil)
    │   ├── BottomNav.js            ← Barre de navigation bas
    │   └── ScreenLayout.js         ← Wrapper réutilisable pour chaque écran
    │
    └── screens/
        ├── MapScreen.js            ← 🗺️  Écran Carte
        ├── CommunityScreen.js      ← 👥 Écran Communauté
        ├── SOSScreen.js            ← 🆘 Écran SOS
        └── ProfileScreen.js        ← 👤 Écran Profil
```

---

## 🚀 Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd VERA_assistance

# Installer les dépendances
npm install

# Android ('Android Studio Installer')
npx expo start 
```

---

## 👥 Guide collaborateur

### Travailler sur un écran
Chaque collaborateur travaille dans **son fichier d'écran** :

| Écran       | Fichier                          | Responsable |
|-------------|----------------------------------|-------------|
| Carte       | `src/screens/MapScreen.js`       | [Nom]       |
| Communauté  | `src/screens/CommunityScreen.js` | [Nom]       |
| SOS         | `src/screens/SOSScreen.js`       | [Nom]       |
| Profil      | `src/screens/ProfileScreen.js`   | [Nom]       |

### Ajouter du contenu à un écran
Remplacez le bloc `<View style={styles.placeholder}>` par votre contenu :

```jsx
// Avant
<View style={styles.placeholder}>
  <Text>Placeholder</Text>
</View>

// Après
<View style={styles.monContenu}>
  <MonComposant />
  <AutreComposant />
</View>
```

### Modifier les couleurs / le thème
Tout est centralisé dans **`src/theme/theme.js`** :
- `Colors` — palette de couleurs
- `Typography` — tailles et poids de police
- `Spacing` — marges et paddings
- `Radius` — arrondis
- `Shadows` — ombres

### Remplacer le logo
Dans `src/components/Header.js`, ligne ~18 :
```js
// Remplacer null par votre source :
const LOGO_SOURCE = require('../../assets/images/logo.png');
// ou
const LOGO_SOURCE = { uri: 'https://votre-url.com/logo.png' };
```

### Ajouter une navigation vers react-navigation
Le `App.js` utilise un `useState` simple pour naviguer.
Pour migrer vers `@react-navigation/bottom-tabs` :
1. Wrap `App.js` dans `<NavigationContainer>`
2. Créer un `createBottomTabNavigator()` avec vos 3 onglets
3. Passer `navigation` en prop aux écrans

---

## 🎨 Conventions de code

- **Composants** : PascalCase (`MonComposant.js`)
- **Styles** : `StyleSheet.create()` en bas de chaque fichier
- **Props** : documenter en commentaire en haut du fichier
- **TODO** : utiliser `// TODO(nom): description`

---

## ♿ Accessibilité (priorité du projet)

Toujours inclure sur les éléments interactifs :
```jsx
<TouchableOpacity
  accessibilityLabel="Description claire de l'action"
  accessibilityRole="button"  // ou 'link', 'image', etc.
  accessibilityHint="Ce qui va se passer après l'appui"
>
```

Ressources :
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [WCAG 2.1 Mobile](https://www.w3.org/WAI/standards-guidelines/wcag/)
