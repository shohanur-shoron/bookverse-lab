from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from django.contrib import messages
from .models import *
from .utills import *
from book.models import Category

def create_account(request):
    if request.method == 'POST':
        firstname = request.POST.get('firstname')
        lastname = request.POST.get('lastname')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        gender = request.POST.get('gender')
        password = request.POST.get('password')
        password_confirm = request.POST.get('password_confirm')
        username = generate_unique_username(firstname, lastname)

        # Check if passwords match
        if password != password_confirm:
            messages.error(request, 'Passwords do not match!')
            return redirect('create_account')

        # Check if phone number already exists
        if Profile.objects.filter(phone=phone).exists():
            messages.error(request, 'Phone number already registered!')
            return redirect('create_account')

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=firstname,
                last_name=lastname
            )

            user.save()

            user.profile.phone = phone
            user.profile.gender = gender
            user.profile.is_user = True
            user.profile.is_reviewer = False
            user.profile.save()

            login(request, user)
            return redirect('update_username')

        except Exception as e:
            if 'user' in locals():
                user.delete()
            messages.error(request, 'An error occurred while creating your account.')
            return redirect('create_account')

    return render(request, 'account/signup.html')

def username(request):
    return render(request, "account/updateUsername.html")

def update_username(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        if username == '':
            messages.error(request, 'Username cannot be empty!')
            return redirect('update_username')

        if username == request.user.username:
            return redirect('upload_image')

        try:
            user = User.objects.get(username=username)
            messages.error(request, 'Username already registered! Pick another one.')
            return redirect('update_username')
        except:
            request.user.username = username
            request.user.save()
            return redirect('upload_image')

    return render(request, 'account/updateUsername.html')


def upload_image(request):
    if request.method == 'POST':
        if 'imageUpload' in request.FILES:
            image = request.FILES['imageUpload']
            if image:
                user = User.objects.get(username=request.user.username)
                user.profile.image = image
                user.profile.save()
                return redirect('add_interest')
            else:
                messages.error(request, "Invalid image file")

    return render(request, 'account/updateProfileImage.html')


def add_interest(request):
    interests = Category.objects.all()
    user_interests = list(request.user.profile.interests.values_list('name', flat=True))

    context = {
        'interests': interests,
        'user_interests': user_interests
    }
    return render(request, 'account/updateInterest.html', context)


def login_user(request):
    if request.method == 'POST':
        login_identifier = request.POST.get('username')
        password = request.POST.get('password')

        try:
            if is_phone_number(login_identifier):
                # It's a phone number, try to get the user by phone
                try:
                    user = Profile.objects.get(phone=login_identifier).user
                    username = user.username
                except Profile.DoesNotExist:
                    messages.error(request, 'User with this phone number not found')
                    return redirect('login_user')

            else:
                username = login_identifier

            # Attempt to authenticate the user
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect(mainHomePage)
            else:
                messages.error(request, 'Invalid username or password')
                return redirect('login_user')

        except Exception as e:
            messages.error(request, f'An error occurred: {str(e)}')
            return redirect('login_user')

    return render(request, "account/login.html")


def mainHomePage(request):
    return render(request, 'homepage.html')

def logout_user(request):
    if request.user.is_authenticated:
        logout(request)

    return redirect(mainHomePage)
