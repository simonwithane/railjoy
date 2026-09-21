# Railjoy for Android

Railjoy now has an Android project built with Capacitor. The existing React interface is packaged inside the APK, so the form and sample journeys load without a network connection. It does not load the Vercel website remotely. Website changes require a new APK build to reach the Android app.

App name: **Railjoy**. Application ID: `com.railjoy.app` (provisional; confirm before a first Play Store release). Android 7/API 24 or newer, with an updated Android System WebView. Saved journeys are local to the app and separate from those in a browser. Clearing app data or uninstalling removes them.

## Download a test APK

Open this repository's Actions page, select a successful **Android APK** run for the desired branch/commit, and download **railjoy-android-debug** from Artifacts. Unzip the download and transfer `app-debug.apk` to an Android phone. Open it and follow Android's installation prompts for that file source. Only install the APK you built or obtained from this repository's workflow.

This is a debug-signed test build, not a Play Store release. GitHub runners use temporary debug signing keys; installing a build signed by a different key requires uninstalling the previous build, which removes local app data. Artifacts expire after 14 days; rerun the workflow to produce another build.

## Local development

Install Android Studio and its SDK platform 36, with Java 21. Set `ANDROID_HOME` or configure `android/local.properties` with your SDK path. Do not commit local paths or signing keys.

```sh
pnpm install --frozen-lockfile
pnpm android:sync
pnpm android:open
```

Choose a connected Android phone or emulator in Android Studio and run the app. Alternatively, `pnpm android:run` runs through Capacitor. `pnpm android:apk` builds `android/app/build/outputs/apk/debug/app-debug.apk`.

## Verification

The Android workflow checks the web build, synchronizes packaged assets, compiles the APK, and runs Android lint. Before release, test on a physical device: launch offline, enter stations, switch One-way/Return, edit dates, adjust passengers, expand voucher, toggle Genius, submit using the soft keyboard, and save a sample journey then relaunch to confirm persistence. Check system bars, keyboard resizing, back navigation, and landscape orientation. CI compilation alone does not establish device testing.

## Release scope

The app retains the website's explicit demo limitation: no live fares, booking, validated vouchers, or hotel-offer integration. Publishing on Google Play is a separate release step requiring a developer account, an owned permanent application ID, release signing, an Android App Bundle, and completed store listing and privacy disclosures. No signing credentials or Play Store uploads are part of this setup.
