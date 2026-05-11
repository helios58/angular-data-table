# REVIEW.md   Code review

## 1
The file name is // UserList.ts and in typescript `Any` disable type checking and it's used everywhere in class property, as an implicit for constructor and functions  



## 2
async loadUsers() {
const res = await fetch('/api/users');
const data = res.json(); 
this.users = data;
}

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

The fetch() function returns a Promise which is fulfilled with a Response object representing the server's response

const data = res.json(); is wrong instead const data = await res.json();  

Actually not using error handling will cause multiple issues, for exemple crashing the entier application and can be hard to locate 

And the function dosen't return anything

## 3

el.innerHTML = `${user.name}`;

unsanitized dom manipulation (XSS vulnerability)

## 4 


getFilteredUsers() {
if (this.filter == null) return this.users;
return this.users.filter((u) => u.name == this.filter);
}

2 Loose equality using ==

Exemple "1" == 1 will return true 

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness

if (this.filter == null) return this.users;

The second one can be intentional (to catch both null and undefined) it's very commun in ES5, it depend also on ESLint config or Sonar quality profile (i actually used it during the assignement since i didn't use and lint during the process)



## 5 


deleteUser(id) {
this.users = this.users.filter(u => u.id !== id);
this.users.forEach(u => {
u.index = this.users.indexOf(u);
});
}

this.users.indexOf(u)

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

The indexOf() method compares searchElement to elements of the array using strict equality (the same algorithm used by the === operator). NaN values are never compared as equal, so indexOf() always returns -1 when searchElement is NaN.

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

const logArrayElements = (element, index /*, array */) => {
  console.log(`a[${index}] = ${element}`);
};

// Notice that index 2 is skipped, since there is no item at
// that position in the array.
[2, 5, , 9].forEach(logArrayElements);
// Logs:
// a[0] = 2
// a[1] = 5
// a[3] = 9

The forEach already have index build in and can be directly directly accessible

In case of array of 10 you are looping 10 times with forEach and this.users.indexOf(u) will reloop 10 times giving a total of 100 Loop 
1000 will loop 1000000 Big O(N^2)  

https://www.geeksforgeeks.org/dsa/what-does-big-on2-complexity-mean/

Also it's mutable, this.users is a shared scope not a local one 

## 6 

The code handle UserList (Filter, Load, Render), the deleteUser(id) better be placed in the CRUD file (speration or concerns)
