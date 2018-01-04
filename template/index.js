const Express = require('express'), // 引入Express
      Mock = require('mockjs'), // 引入MockJS
      Config = require('./mock.config.js'), // 引入配置文件
      Fs = require('fs'), // 引入文件模块
      Path = require('path'), // 引入路径模块
      BodyParser = require('body-parser'), // 引入body-parser模块解析json
      Multipart = require('connect-multiparty'), // 引入connect-multiparty模块解析json
      app = Express(), // 实例化express
      apiPath = Path.join(__dirname, 'api'); // api路径

app.use(function (req, res, next) { // 跨域支持
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

fileDisplay(apiPath); // 遍历api目录

function fileDisplay(filePath) { // 遍历文件夹

  Fs.readdir(filePath, (err, files) => { // 读取文件夹

    if (err) { // 错误
      console.warn(err)
    } else { // 成功

      files.forEach(fileName => { // 遍历文件

        let _path = Path.join(filePath, fileName); // 当前文件路径

        Fs.stat(_path, (err, stats) => { // 获取文件信息

          if (err) { // 错误
            console.warn(err)
          } else { // 成功

            if (stats.isFile()) { // 如果是文件

              if (/.+\.js$/.test(fileName)) { // 只读取js文件

                let _p = Path.resolve(filePath, fileName), // 当前文件完整路径
                    _c = require(_p); // 当前文件mock配置内容

                server(_p.replace(apiPath, '').split('.')[0], _c); // api文件夹内文件相对路径名称(不带后缀)即为url地址

              }

            } else if (stats.isDirectory()) { // 如果是文件夹
              fileDisplay(_path); // 遍历文件夹
            }

          }

        })

      })

    }
  })

}

function server(path, mock) { // 创建服务

  const multipartMiddleware = Multipart(); // 实例化connect-multiparty

  if (Config.postKind === 'application/json') {
    app.use(BodyParser.json({ limit: '1mb' }));  // 指定参数使用 json 格式
  }

  if (Config.postKind !== 'form-data') {
    app.use(BodyParser.urlencoded({
      extended: true
    }));
  }

  app.all(path, multipartMiddleware, function (req, res, next) {

    let _params;

    if (req.method === 'POST') { // POST请求
      _params = req.body;
    } else { // GET或其他
      _params = req.query;
    }

    const _verify = mock.verifyParams;

    let _err = [];

    for (let val in _verify) { // 遍历校验参数

      let _val = _verify[val],
          _addErr = false;

      if (_val instanceof RegExp) { // 如果是正则
        if (!_val.test(_params[val])) {
          _addErr = true;
        }
      } else if (/^@/.test(_val)) { // 如果是类型

        let _in;

        switch (_val.substring(1)) {
          case 'string':
          case 'number':
          case 'boolean':
            _in = typeof _params[val] === _val.substring(1);
            break;
          case 'array':
            _in = _params[val] instanceof Array;
            break;
          case 'object':
            _in = (typeof _params[val]) === _val.substring(1) && !(_params[val] instanceof Array);;
            break;
        }

        if (!_in) {
          _addErr = true;
        }

      } else { // 其他

        if (_params[val] !== _val) {
          _addErr = true;
        }

      }

      _addErr && _err.push(val + '参数错误');

    }

    if (_err.length > 0) {
      res.json({error: _err});
    } else {
      res.json(Mock.mock(mock.returnData).data);
    }

  });

}

console.log('服务已启动, 地址: ' + '\x1B[36m%s\x1B[0m', 'http://localhost:' + Config.port + '/actionName');
console.log('api文件夹存放接口文件, 使用MockJS, 参考: ' + '\x1B[36m%s\x1B[0m', 'http://mockjs.com/examples.html');

app.listen(Config.port); // 监听端口
