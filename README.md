# Lineage Kernelcrafter

Specialized Android kernel development dashboard for SM8550 (Kalama) and modern GKI devices.

## Features
- **Project Setup**: Custom repo URL and branch management.
- **Kernel Patching**: Support for KernelSU (Official & Next), SUSFS, and maxsteeel's NoMount.
- **AI Assistant**: Troubleshooting built on Genkit for analyzing build logs.
- **Flashable Creator**: Generate AnyKernel3 ZIPs for recovery installation.

## Mobile Build (Android APK)
This project is PWA-ready and Capacitor-compatible.
To prepare for an Android APK build (e.g., using Antigravity):

1. Run `npm run build` to generate the production web files.
2. Run `npm run zip-project` to create a package for the build server.

## Scripts
- `npm run dev`: Start development server.
- `npm run zip-project`: Create a ZIP of the source for Antigravity/build tools.