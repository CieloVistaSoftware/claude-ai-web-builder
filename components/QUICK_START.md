# Quick Fix: Add Dashboard Script

Since the `start:dashboard` script is missing, you can add it manually to your package.json:

## **Method 1: Edit package.json directly**

Open `components/package.json` and add this line to the scripts section:

```json
{
  "scripts": {
    "start": "vite --host 0.0.0.0 --port 3000",
    "start:dashboard": "vite --host 0.0.0.0 --port 3000",
    "start:anchor": "vite --host 0.0.0.0 --port 3001 --mode anchor",
    // ... other scripts
  }
}
```

## **Method 2: Use the default start script**

Since I created `main.tsx` and `index.html` that automatically load the dashboard:

```bash
cd components
npm start
```

This will now open the dashboard at `http://localhost:3000`

## **Method 3: Alternative commands**

You can also run:

```bash
# If you have the dashboard script added
npm run start:dashboard

# Or use the default start (now points to dashboard)
npm start

# Or run vite directly
npx vite --host 0.0.0.0 --port 3000
```

The dashboard is now accessible through any of these methods!