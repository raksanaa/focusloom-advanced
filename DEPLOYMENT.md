# Deployment Guide: MongoDB Atlas + Render

## Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name after `.net/`: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/focusloom?retryWrites=true&w=majority`

## Step 2: Deploy Backend to Render

1. **Push Code to GitHub**
   - Create a GitHub repository
   - Push your code:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin <your-github-repo-url>
     git push -u origin main
     ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: focusloom-backend
     - **Root Directory**: backend
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   
4. **Add Environment Variables**
   - In Render dashboard, go to "Environment"
   - Add these variables:
     - `MONGODB_URI`: (paste your MongoDB Atlas connection string)
     - `JWT_SECRET`: (generate a random string, e.g., use https://randomkeygen.com/)
     - `NODE_ENV`: production
     - `PORT`: 10000
   
5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://focusloom-backend.onrender.com`)

## Step 3: Deploy Frontend to Render

1. **Update Frontend Environment**
   - Create `frontend/.env.production`:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com
     ```

2. **Deploy Frontend**
   - In Render, click "New +" → "Static Site"
   - Connect same GitHub repository
   - Configure:
     - **Name**: focusloom-frontend
     - **Root Directory**: frontend
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: build
   
3. **Add Environment Variable**
   - Add `REACT_APP_API_URL` with your backend URL

4. **Deploy**
   - Click "Create Static Site"
   - Your app will be live at `https://focusloom-frontend.onrender.com`

## Step 4: Test Your Deployment

1. Visit your frontend URL
2. Register a new account
3. Test login and features
4. Check Render logs if issues occur

## Important Notes

- Free tier Render services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- MongoDB Atlas free tier has 512MB storage limit
- Keep your MongoDB credentials secure
- Never commit `.env` files to GitHub

## Troubleshooting

**Backend won't start:**
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

**Frontend can't connect to backend:**
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running (check Render dashboard)

**Database connection fails:**
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check username/password in connection string
- Ensure database user has correct permissions
