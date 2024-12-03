from django.shortcuts import render

def reactIndex(request)  :
    return render(request,'index.html',name='react-index')