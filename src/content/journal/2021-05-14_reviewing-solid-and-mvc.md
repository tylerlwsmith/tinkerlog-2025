---
title: Reviewing SOLID and MVC
slug: reviewing-solid-and-mvc
tags: oop, solid, mvc, architecture 
published: 2021-05-14
---

I've found myself increasingly thinking about object-oriented programming principles as I work on my employer's flagship software product.

Today I went down a rabbit hole reviewing SOLID principles and MVC architecture for Tkinter-based Python apps.

## SOLID OOP

I rewatched the Laracast's series on SOLID object-oriented programming principles. I had originally watched this series in early 2018 when I first started learning Laravel. It felt like so much ceremony when I first watched it, and I didn't understand the benefits. 

I thought, _"When am I going to build a PHP app that needs an interface to calculate the area of shapes?"_

Anyway, here are the SOLID principles as I understood them from the Laracast videos. It's very possible that my understanding of these is wrong.

### 1. Single responsibility principle

A class should only do one thing. Jeffery Way described it as "a class should only ever have one reason to update." I don't understand this interpretation. He did show a class that handled generating some kind of reports that had some display logic in it. Aside from WordPress and restrictive Django templates that force tightly entangling data and views, I don't typically see the SRP violated in this way.

In the code I work on, I tend to see this in classes that handle querying, data requests, transforming the request and persisting it all in one method. Often, each item of a collection will have to do each one of these steps sequentially before the next item can process.

Generally, I find it better to have a class that can fetch the data, a request class, a response class, and maybe a transformation class for manipulating the data if necessary. Breaking these into individual classes means you can test these separately and compose them in different ways.

### 2. Open/closed principle

"An object should be open for expansion but closed for modification." The example that's always used here is having a collection of different kinds of shapes and trying to calculate the total area of all of the shapes. The first attempt implementation may check the shape then have different logic for calculatinng the area based on the shape.

The open/closed principle would argue that you should attach something like a `getArea()` method to the shapes and make all shapes conform to an interface that has that method on it, then the total area could be calculated by summing the `getArea()` method on every shape. That way as you create more shapes, you don't have to edit a massive block of `if` statements.

I don't build applications that sum the area of shapes, but I do deliver messages via several strategies, and I have APIs that provide similar information. Building these to common interfaces has been beneficial.

### 3. Liskov substitution principle
This principle says that any subclass should be able to be use in place of its parent class. For example, if you have a `VideoPlayer` class and a subclass of a `Mp4Player` that threw an error when you tried to play an AVI file, this would violate Liskov's sustitution principle. I don't remember the recommended approach for working around this.

### 4. Interface segregation principle

The interface used should only require the implementation of the methods actually used. You should never need to put a method on a class that the class does not use.

### 5. Dependency inversion

Jeffery made it clear that this principle wasn't the same as dependency injection, but I can't remember exactly how they were different. The moral of this principle's story was favor interfaces over concrete implementations.

### Thoughts on SOLID

SOLID principles seemed like pedantic overkill when I was first exposed to them in 2018, but now I see the value of them and use several of them often. That said, in basic CRUD apps, SOLID principles can be overkill that lead to needless abstraction, complexity and indirection.

## MVC in Python

I'm trying to learn how to apply the MVC pattern to my Tkinter app. Traditional web MVC framework MVC is a lie, it's really RMVC: Router, Model, View, Controller. The router plays a critical role in how the frameworks function, and I don't know how to apply MVC principles to traditional UI apps. How is the app initialized? Do I start with a View that initializes its Controller? That can't be right...

I poked around and found some Tkinter examples today. The controller was the entry point to the application and created the view and the model. The view would call functions on the controller when the user took actions. The controller would update the model then update the UI to reflect the changes.

Something that bothered me on some of the examples I saw was that the controller felt like it had too much knowledge of the view. I saw code that kind of looked like `self.view.text_box_1.set_text('hello world')` (this is pseudo code). This feels a little janky to me: the controller is reaching into the view's dependencies and manipulating them directly. If the text box's name changed on the view, that change would cascade into the controller. By reaching into the view to grab `text_box_1`, we've violated the _Law of Demeter_: you're talking to your dependency's inner dependencies directly.

I'm still learning about MVC in Python and desktop application development, so it's possible that this is a common pattern. However, for truly loose coupling, it seems like there should be a method on the view for updating the text box that is independent of its name or implementation. That way of the GUI toolkit the app used ever changed, you could built a view with the same interface and the controller wouldn't know the difference.

## Final thoughts for the night

This is all good and clever, but does it actually help? Yes, but often no. "Code to an interface" is great advice, but it's easy to come up with the wrong interface and the wrong abstraction. You can easily build an interface to describe your first concrete implementation, only to find your second concrete implementation now needs methods that it doesn't use because that strategy doesn't support the same functionality.

I think the hardest parts about object oriented technology are discovering the nature of the thing that you're trying to build and avoiding premature abstraction.