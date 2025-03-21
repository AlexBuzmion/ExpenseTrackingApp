const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return "com.finotech.iSpend.dev";
    } else if (IS_PREVIEW) {
        return "com.finotech.iSpend.preview";
    } else {
        return "com.finotech.iSpend";
    }
}

const getAppName = () => {
    if (IS_DEV) {
        return "iSpend (Dev)";
    } else if (IS_PREVIEW) {
        return "iSpend (Preview)";
    } else {
        return "iSpend";
    }
}

export default {


    "name": getAppName(),
    "slug": "ExpenseTrackingApp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
        "image": "./assets/images/splash-icon.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
    },
    "ios": {
        "supportsTablet": true,
        "bundleIdentifier": getUniqueIdentifier(),
        "infoPlist": {
            "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
        "adaptiveIcon": {
            "foregroundImage": "./assets/images/adaptive-icon.png",
            "backgroundColor": "#ffffff"
      },
      "package": getUniqueIdentifier(),
    },
    "web": {
        "bundler": "metro",
        "output": "static",
        "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
        "expo-router"
    ],
    "experiments": {
        "typedRoutes": true
    },
    "extra": {
        "router": {
            "origin": false
        },
        "eas": {
            "projectId": "c1b384ea-1e79-4fa8-9571-7edbb5b1e77e"
        }
    },
    "owner": "ispend"
}

