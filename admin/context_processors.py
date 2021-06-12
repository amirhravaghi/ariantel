
# Data
def data(request):

    context = {
        "admin_full_name": request.session.get("admin_full_name")
    }

    return context

# data({})
