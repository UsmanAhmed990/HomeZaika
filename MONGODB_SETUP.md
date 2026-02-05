# MongoDB Setup Instructions

## Windows

### Option 1: Start MongoDB Service
```powershell
# Open PowerShell as Administrator
net start MongoDB
```

### Option 2: Run MongoDB Manually
```powershell
# Navigate to MongoDB bin directory
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# Start MongoDB
.\mongod.exe --dbpath="C:\data\db"
```

### Option 3: Install MongoDB (if not installed)
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service
5. Create data directory: `mkdir C:\data\db`

## macOS

### Using Homebrew
```bash
# Start MongoDB
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community
```

### Manual Start
```bash
mongod --config /usr/local/etc/mongod.conf
```

## Linux (Ubuntu/Debian)

```bash
# Start MongoDB
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

## Verify MongoDB is Running

Open a new terminal and run:
```bash
mongosh
```

You should see the MongoDB shell. Type `exit` to quit.

## After MongoDB is Running

1. **Start Backend:**
```bash
cd backend
npm start
```

2. **Frontend is already running at:** http://localhost:5173

3. **Access the application** in your browser!

---

**Note:** The backend MUST have MongoDB running to work. The frontend will display the UI but API calls will fail without the backend.
