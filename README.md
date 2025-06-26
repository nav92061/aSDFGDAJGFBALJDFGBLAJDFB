# Global Sports Tycoon: Prospect Hunter

This is a browser-based tycoon game deployed as a Cloudflare Worker.

## 🚀 Deploy to Cloudflare Workers

### Prerequisites
- [Cloudflare account](https://dash.cloudflare.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/)

### 1. Install Wrangler
```
npm install -g wrangler
```

### 2. Authenticate Wrangler
```
wrangler login
```

### 3. Deploy the Worker
```
wrangler publish
```

This will deploy your game to a Cloudflare Worker and give you a public URL.

### 4. Local Development
```
wrangler dev
```

## Project Structure
- `worker_index.js` - The Worker script serving the game
- `wrangler.toml` - Cloudflare Worker configuration
- `README.md` - This file

---
Enjoy your tycoon game on the edge! 🌍🏆 