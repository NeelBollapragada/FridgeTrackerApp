# Fridge Tracker React Native App

A mobile app for managing what's in your fridge, built to help households stay organized, reduce food waste, and get smart recipe suggestions using AI.

## App Features

- Offline-first design for basic functionality without internet
- Search functionality to add food from local database or Open Food Facts
- AI recipe assistant included with 5 prompts per day
- Household collaboration mode for shared fridges
- Shopping list with fridge checking feature
- Add custom food items which are saved for future reuse
- Quantity and expiry tracking for every fridge item
- Cloud sync to keep data across devices and used for household collaboration

## Implementation and Tech Stack

- Built with **React Native** using **Expo** and **expo-router**
- **SQLite** used for offline local storage of fridge, shopping list, AI chats, and food database
- **Appwrite** used for authentication and backend syncing - used to keep household and fridge data
- **NodeJS** used for backend functions, deployed on Render
- **Open Food Facts API** for food search and initial food database
- **Mistral (via OpenRouter)** for AI recipe chats
- **NativeWind, Native-Paper** used for styling
- Fridge CRUD actions work locally offline first then on cloud if online using `@react-native-community/netinfo`
- Handles multiple users and shared fridge data via household IDs

## Usage

1. Launch the app
2. _(Optional)_ Register with a unique username if you want cloud sync and household features
3. Search items to add to your fridge
4. Tap on a item to edit quantity, unit or expiry
5. Use the shopping list tab to make a shopping list and for easy check of items already in fridge
6. Use the AI-assistant for recipes, and cooking ideas
7. Create or join a household to share your fridge with others
8. Switch between **personal** and **household** fridge views
9. Works offline, internet is needed for AI chats, cloud sync and household features

## Project Structure

- `tabs` - App screens
  - `index.jsx` - Homepage which shows fridge contents, with personal/household toggle, also has browsing and adding to fridge ability
  - `list.jsx` - Shopping list screen
  - `assistant.jsx` - AI assistant interface storing previous chats
  - `profile.jsx` - Register/login page and manages creating/joining/leaving households

- `components` - Main components used _(not all included)_
  - `FridgeCard.jsx` - Reusable component used to display fridge item
  - `AddFoodModal.jsx` - Component used to add food from local/OpenFoodFacts database, also used to create and save custom food items
  - `ChatMessage.jsx` - Reusable component to display user, assistant and error message chats for the AI-assistant screen, assistant messages displayed in markdown format

- `services` - All services used for authentication, backend requests etc.
  - `appwrite.js`, `authService.js` - Appwrite authentication + current user information
  - `fridgeSync.js`, `householdUsers.js` - Calls to custom backend (hosted on Render)
  - `sqlite.js` - Local storage layer for offline food database, fridge, shopping list and ai chat history
  - `netinfo.js` - Network aware logic
  - `openFood.js`, `openRouter.js` - calls to Open Food Facts server and Open Router AI service (routed through backend)

## Future Improvements

- Add local notifications for items nearing expiry
- Complete barcode scanning functionality
- Add calender of daily food logs with nutritional breakdown
- Add internationalization for multilingual support
