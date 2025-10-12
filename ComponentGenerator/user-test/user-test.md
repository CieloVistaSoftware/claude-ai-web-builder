# UserTest

test

## Installation

```html
<script type="module" src="user-test.js"></script>
```

## Usage

### Basic Usage

```html
<user-test
  name="value"
></user-test>
```

### Programmatic Usage

```javascript
const element = document.createElement('user-test');
element.name = "value";
document.body.appendChild(element);
```

## Attributes


| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | `''` | the name |


## Properties


| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | the name |


## Events


| Event | Description | Detail |
|-------|-------------|--------|
| `onclick` | onclick | `{ timestamp: number }` |
| `onClick` |  | `{ timestamp: number }` |

### Event Examples


```javascript
element.addEventListener('onclick', (event) => {
  console.log('onclick:', event.detail);
});
```


```javascript
element.addEventListener('onClick', (event) => {
  console.log('onClick:', event.detail);
});
```



## Slots


| Slot | Description |
|------|-------------|
| `default` | default |

### Slot Example

```html
<user-test>
  <div slot="default">default</div>
</user-test>
```


## Example

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="user-test.js"></script>
</head>
<body>
  <user-test name="Example"></user-test>
  
  <script>
    const element = document.querySelector('user-test');
    element.addEventListener('onclick', (e) => {
      console.log('Event fired:', e.detail);
    });
  </script>
</body>
</html>
```

## Browser Support

- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Author

jp

## License

MIT