const Mock = require('mockjs'), // 引入Mock
      Random = Mock.Random; // Mock随机函数

Random.name(); // 随机英文名字
Random.cname(); // 随机中文名字
Random.word(); // 随机英文字符
Random.cword(); // 随机中文字符
Random.title(); // 随机英文标题
Random.ctitle(); // 随机中文标题
Random.sentence(); // 随机英文句子
Random.csentence(); // 随机中文句子
Random.paragraph(); // 随机英文段落
Random.cparagraph(); // 随机中文段落
Random.image(); // 随机图片
Random.datetime(); // 随机时间

module.exports = {
  verifyParams: { // 请求参数校验
    'actionName': 'getInfo', // 字符串
    'type': '@object', // 类型
    'mobile': /^1\d{10}$/ // 正则
  },
  returnData: { // 返回参数
    'data|1': [
      {
        'int|+1': 200, // 整数
        'float|0-0.2': 1, // 小数
        'boolean|1-2': false, // 布尔
        'datetime': '@datetime', // 时间
        'image': '@image("200x100", "#50B347", "#FFF", "Image")', // 图片
        'name|1': ['@name', '@cname'], // 姓名
        'word|1': ['@word(3)', '@cword(3)'], // 字符
        'title|1': ['@title(5)', '@ctitle(5)'], // 标题
        'sentence|1': ['@sentence(3)', '@csentence(3)'], // 句子
        'paragraph|1': ['@paragraph(2)', '@cparagraph(2)'], // 段落
        'regexp|3': /\d{5,10}\-/, // 正则
        'regexp2': function () { // 函数
          return this.regexp.substring(0, this.regexp.length - 1)
        }
      }
    ]
  }

}
