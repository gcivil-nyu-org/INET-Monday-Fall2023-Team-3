# build frontend project
cd ./frontend
npm run build
cd ..
# create backend static
cd ./backend
rm -rf static
mkdir static
cd ..
# copy frontend files to backend
cp -r ./frontend/build/* ./backend/static
# # backend migration
# cd ./backend
# python manage.py makemigrations
# python manage.py migrate
# cd ..

# # fix format
cd ./backend
# black .
# flake8 .
python manage.py runserver