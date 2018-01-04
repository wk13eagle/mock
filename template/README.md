## {{ name }}

> {{ description }}

所有接口文件存放于api目录，`mock.config.js`是配置文件。

##### mock.config.js

```javascript
{
  port: '13131', // 端口号
  postKind: 'application/json', // post方式
  verify: true // 开启校验
}
```

**port** : 默认 `13131` 。
**postKind** : 默认 `application/json`, 使用post数据使用json格式。可选择 `www-form-urlencoded` , `form-data` , `application/json` 。
**verify** : 默认 `true` , 开启校验。校验规则在接口文件的 `verifyParams` 配置。

api中的接口文件名称即是接口名称, 例如示例中的 `getInfo.js` , 接口访问地址为 [http://localhost:13131/getInfo](http://localhost:13131/getInfo) 。

``` javascript
module.exports = {
  verifyParams: {
    // 校验参数
  },
  returnData: {
    'data|1': [
      {
        // 返回数据
      }
    ]
  }
}
```

**verifyParams** 参数类型
* 具体的值, 例如 `12`, `true`, `"hello"` 等;
* 可以使用类型, 例如 `@string` 检测是否为字符串, 支持 `@string`, `number`, `boolean`, `array`, `object` 。
* 正则

**returnData** 参数类型
使用 [MockJS](http://mockjs.com/examples.html) 语法, 生成规则放在 `data|1` 中, 例如:
``` javascript
'data|1': [
  {
    // 返回数据
    'int|+1': 200 // 整数
  }
]

```
