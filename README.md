# Choreminder 🏠

A family chore reminder app for mobile use, built with [Expo](https://expo.dev) and React Native.

## Environment Configuration

Copy `.env.example` to `.env` to configure the app:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `API_URL` | Backend API URL (optional for local-only use) |
| `NODE_ENV` | Environment mode (`development` or `production`) |
| `FAMILY_ID` | Unique identifier for each family (see below) |
| `DEBUG` | Enable debug mode (`true` or `false`) |

### Multi-Family Support (App Store Deployment)

**Line 3 of `.env` (`FAMILY_ID`)** is crucial for understanding how multiple families can use this app from the App Store:

#### Current Architecture (Local Storage)
The app currently uses `AsyncStorage` for local device storage. This means:
- Each device has its own isolated data
- No `FAMILY_ID` is needed for single-device use
- Family members on different devices cannot share data

#### Recommended Approach for Multi-Family App Store Deployment

For an app published to the App Store with multiple families, **DO NOT** hardcode a static `FAMILY_ID` in `.env`. Instead, implement one of these approaches:

1. **Dynamic Family ID Generation**
   - Generate a unique family ID when the first family member sets up the app
   - Store it in secure device storage (not `.env`)
   - Other family members join by entering or scanning the family ID
   - Example: `fam_a1b2c3d4-e5f6-7890-abcd-ef1234567890`

2. **Backend Authentication**
   - Implement user authentication (e.g., Firebase, Supabase)
   - Create family groups in the backend
   - Invite family members via email or invite links
   - Sync data across devices using the cloud backend

3. **Apple/Google Family Sharing**
   - Use platform-native family sharing features
   - Leverage iCloud (iOS) or Google Play Family Library (Android)

The `.env.example` file demonstrates a development-only `FAMILY_ID` for testing purposes.

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up environment variables

   ```bash
   cp .env.example .env
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
