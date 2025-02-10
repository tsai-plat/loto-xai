# Code contribution guideline

1. first clone loto-xai repository
2. checkout your local work branch
3. install dependecy packages
4. development feature logic on your local branch 
5. local test 
6. merge your local code to feat-<somefeatures> branch & push 
7. the repository owner will audit your features & codes
8. the repository owner merge your feature code into main branch
9. publish library version

```bash
git clone https://github.com/tsai-plat/loto-xai.git loto-xai

cd loto-xai

git checkout local

pnpm install

```

## Commitlint rule

> @tsailab commitlint rules like [@commitlint/config-angular](https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-angular/README.md)

```text
<type>(<scope>): <subject> // 必填, 描述主要修改类型和内容。注意冒号后面有空格
<BLANK LINE>
<body> // 描述为什么修改, 做了什么样的修改, 以及开发的思路等等
<BLANK LINE>
<footer> // 放 Breaking Changes 或 Closed Issues
```

## type-enum

| type | Comments | Remark |
| -------- | ------------------------- | ------------------- |
| feat | 新功能（feature）表示在代码库中新增了一个功能 | 这和语义化版本中的 MINOR 相对应 |
| fix | 表示在代码库中修复了一个 bug | 这和语义化版本中的 PATCH 相对应 |
| chore | 当一个提交有其他修改（不在上述类型中的修改） | 一般用在代码合并后发布提交，例如： chore(bot): release version x.x.x  |
| ci | 当一个提交修改了持续集成，示例范围：Travis、Circle、BrowserStack、SauceLabs | -- |
| docs | 当一个提交仅修改了 md 文件或其他阅读性文件时 | -- |
| build | 当一个提交修改了编译相关的内容，发布版本、对项目构建或者依赖的改动 | 即npm、gulp、yarn等文件的修改时，须使用 build 类型 |
| pref | 当一个提交包含优化相关，比如提升性能、优化用户体验时 | -- |
| refactor | 当一个提交既不修复错误也不添加功能的代码更改 | -- |
| revert | 代码回退 | -- |
| refactor | 重构代码，不影响功能和对外提供API 时 | -- |
| style | 当一个提交仅修改了代码格式（如删除空格、换行等）或不影响代码逻辑本身的修改时| -- |




