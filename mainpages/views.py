from django.http import JsonResponse
from django.shortcuts import render
from book.models import *
from users.models import *
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User

def mainHomePage(request):
    books = Book.objects.all()

    contex = {
        'books': books
    }
    return render(request, 'homePage/home.html', contex)


def specific_category(request, id):
    # Get the category object to pass to the template
    category = get_object_or_404(Category, id=id)

    # Get all books for this category
    books = Book.objects.filter(category=category)

    context = {
        'books': books,
    }

    return render(request, 'homePage/home.html', context)

def category_page(request):
    categories = Category.objects.all()


    context = {'categories': categories}
    return render(request, "homePage/categorys.html", context)


def book_ai(request):
    if request.user.is_authenticated:
        return render(request, 'homePage/gemini.html')
    else:
        return render(request, 'homePage/authNeed.html')


def user_profile(request):
    """
    Displays the profile page for a given username.

    Fetches the user, their profile, interests, favorites, reading lists,
    and followed authors to pass to the template.
    """
    # 1. Get the User object for the requested username
    #    - Returns a 404 error if the user does not exist.
    profile_user = request.user

    # 2. Get the associated Profile object
    #    - Uses prefetch_related to efficiently load the 'interests' ManyToMany field,
    #      avoiding extra database queries when accessing profile.interests.all in the template.
    try:
        profile = Profile.objects.prefetch_related('interests').get(user=profile_user)
    except Profile.DoesNotExist:

        profile = None

    favorite_books = Favorite.objects.filter(user=profile_user)\
                                     .select_related('book')\
                                     .order_by('-timestamp')[:10]

    reading_statuses = ReadingStatus.objects.filter(user=profile_user)\
                                            .select_related('book')\
                                            .order_by('-last_updated')

    books_to_read = reading_statuses.filter(status='to_read')[:10]
    books_reading = reading_statuses.filter(status='reading')[:10]
    books_completed = reading_statuses.filter(status='completed')[:10]


    followed_authors = Author.objects.filter(followers=profile_user)[:10]

    context = {
        'profile_user': profile_user, # The User object whose profile is being viewed
        'profile': profile,           # The associated Profile object (or None)
        'favorite_books': favorite_books, # QuerySet of Favorite objects
        'books_to_read': books_to_read,   # QuerySet of ReadingStatus objects
        'books_reading': books_reading, # QuerySet of ReadingStatus objects
        'books_completed': books_completed,# QuerySet of ReadingStatus objects
        'followed_authors': followed_authors, # QuerySet of Author objects
    }

    # 7. Render the template with the context data
    return render(request, 'homePage/userProfile.html', context)

def congratulations_page(request):
    request.user.profile.is_reviewer = True
    request.user.profile.save()
    return render(request, 'homePage/congratulations.html')


def events(request):
    events = Event.objects.filter(is_valid=True)

    context = {
        'events': events
    }

    return render(request, 'homePage/event.html', context)


def search_items(request):
    # Get all book instances
    books = Book.objects.all()
    categories = Category.objects.all()
    authors = Author.objects.all()

    # Prepare the data as a flat list
    data = []
    for book in books:
        data.extend([book.name])

    for categorie in categories:
        data.extend([categorie.name])

    for author in authors:
        data.extend([author.name])

    # Return the data as JSON
    return JsonResponse(data, safe=False)