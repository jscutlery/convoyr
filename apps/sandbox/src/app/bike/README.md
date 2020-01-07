Generated with : https://www.json-generator.com/

```
[
  '{{repeat(30, 30)}}',
  {
    id: '{{guid()}}',
    name: '{{state()}}',
    color: function (tags) {
      var fruits = ['red', 'blue', 'green', 'orange', 'pink'];
      return fruits[tags.integer(0, fruits.length - 1)];
    },
    price: '{{integer(100, 2000)}}',
        color: function (tags) {
      var fruits = ['red', 'blue', 'green', 'orange', 'pink'];
      return fruits[tags.integer(0, fruits.length - 1)];
    },
    type: function (tags) {
      var types = ['mtb', 'city', 'kids', 'electric'];
      return types[tags.integer(0, types.length - 1)];
    }
  }
]
```