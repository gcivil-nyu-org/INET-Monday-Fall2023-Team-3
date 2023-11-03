cd frontend
npm run build
cd ..
rm -rf backend/static
mkdir backend/static
cp -r frontend/build/* backend/static
python backend/manage.py migrate