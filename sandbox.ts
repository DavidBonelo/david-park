console.log(
  JSON.stringify({
    name: "test",
    identification: "test",
    email: "test",
    height: 1,
    age: 1,
    contact: "test",
  })
);
const xd1 = Number(undefined);
// const xd2 = parseInt(undefined);

console.log(xd1, );

class MyError extends Error {}

const myError = new MyError("My error message");
const otherError = new Error("Other error message");
if (myError instanceof MyError) {
  console.log("mi errorsito");
}
if (otherError instanceof MyError) {
  console.log("mi errorsito");
} else {
  console.log("no es mi errorsito");
}
