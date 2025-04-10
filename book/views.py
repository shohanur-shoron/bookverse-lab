from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import CreateView, UpdateView
from django.http import JsonResponse
from django.urls import reverse_lazy
from .models import Author, Book, Category, Favorite
from .forms import AuthorForm, CategoryForm
from django.contrib import messages
from .models import Author, Category
from django.http import JsonResponse


def check_author(name):
    try:
        author = Author.objects.get(name=name)
        return True
    except Author.DoesNotExist:
        return False

def check_catecory(name):
    try:
        category = Category.objects.get(name=name)
        return True
    except Category.DoesNotExist:
        return False


def create_book(request):
    global author
    global category
    if request.method == 'POST':
        if check_author(request.POST['authors']):
            author = Author.objects.get(name=request.POST['authors'])
        else:
            author = Author.objects.create(name=request.POST['authors'])
            author.save()
            author.added_by = request.user
            author.save()

        if check_catecory(request.POST.get('category')):
            category = Category.objects.get(name=request.POST.get('category'))
        else:
            category = Category.objects.create(name=request.POST['authors'])
            category.save()
            category.added_by = request.user
            category.save()
        try:
            new_book = Book(
                name=request.POST.get('bookName'),
                description=request.POST.get('description'),
                category=category,
                price=request.POST.get('price'),
                authors=author,
                rating=request.POST.get('rating'),
                suggestions=request.POST.get('suggestions'),
                link=request.POST.get('link'),
                pages=request.POST.get('pages', 0),
                language=request.POST.get('language'),
                chapters=request.POST.get('chapters', 0),
                favorites_chapters=request.POST.get('favoritesChapters'),
                favorites_quotes=request.POST.get('favoritesQuotes'),
                series=request.POST.get('series'),
                best_character=request.POST.get('bestCharacter'),
                awards=request.POST.get('awards'),
                format=request.POST.get('format')
            )
            new_book.save()

            # Handle file upload only if a file is present
            if 'bookCover' in request.FILES and request.FILES['bookCover']:
                new_book.image = request.FILES['bookCover']
                new_book.save()

            messages.success(request, 'Book created successfully!')
            return redirect('mainHomePage')

        except Exception as e:
            messages.error(request, f'Error creating book: {str(e)}')
            # Return to form with entered data
            return render(request, 'forms/book_form.html', {'form_data': request.POST})

    # If GET request, show empty form
    return render(request, 'forms/book_form.html')



def add_to_favorites(request, id):
    if request.user.is_authenticated:
        book = get_object_or_404(Book, pk=id)
        user = request.user
        favorite = Favorite.objects.create(user=user, book=book)
        favorite.save()
        return JsonResponse("Favorites Added with id: {id}".format(id=favorite.id), safe=False)
    else:
        return redirect('login_user')

def remove_from_favorites(request, id):
    book = get_object_or_404(Book, pk=id)
    user = request.user
    favorites = Favorite.objects.filter(user=user, book=book)

    if favorites.exists():
        favorites.delete()
        return JsonResponse("Favorites Removed Successfully", safe=False)
    return JsonResponse("Favorites Not Found", safe=False)


def favorites_books(request):
    if request.user.is_authenticated:
        favorite_books = Book.objects.filter(favorite__user=request.user)
        context = {
            'books': favorite_books,
            'favorite_books': favorite_books,
        }
        return render(request, "homePage/home.html", context)
    else:
        return redirect('login_user')



def get_authors(request):
    author_names = list(Author.objects.values_list('name', flat=True))
    return JsonResponse(author_names, safe=False)

def get_category(request):
    category_names = list(Category.objects.values_list('name', flat=True))
    return JsonResponse(category_names, safe=False)