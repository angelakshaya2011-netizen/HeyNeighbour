# Hey Neighbor

## Run locally

Go to the app folder:

```bash
cd C:\codebase\HeyNeighbour\HeyNeighbour
```

Start the local web server:

```bash
python -m http.server 8000
```

If `python` is not recognized, use:

```bash
py -m http.server 8000
```

Then open the app in your browser at:

```text
http://localhost:8000
```

This app works best in Chrome instead of Edge.

## Stop the local server

In the terminal where the server is running, press:

```bash
Ctrl + C
```

## Notes

- This is a static web app, so no build step or package installation is required.
- The app is served directly from the project folder.
