# shopify-launch-check

一个给 AI 编程智能体用的技能：在 Shopify 店铺上线前做一遍全面检查，按轻重缓急给出修改清单，同时输出给人看的 Markdown 报告和经过校验的 JSON 报告。

[English](README.md)

## 它能做什么

把店铺网址交给智能体，它会像第一次来的顾客、搜索引擎和监管机构那样把店铺走一遍，分三个阶段：

1. **侦察**：从菜单、页脚和 sitemap 摸清店铺结构，挑出一小组覆盖所有页面模板的样本页。
2. **检查**：对样本页逐项检查店面、结账和政策、SEO 和性能，以及所在地区的本地规则。
3. **报告**：把每个问题分为 `critical`（严重）、`important`（重要）、`nice_to_have`（可选）三级，写出 Markdown 和 JSON 两份报告，并校验 JSON。

每条问题都会写明位置、看到了什么、为什么重要、具体怎么改，以及是**亲眼所见**还是**推断**。内置澳大利亚本地规则：含 GST 的单一总价、违规的"不退款"措辞、税务发票要素。

技能不会下单、提交表单或输入付款信息。需要 Shopify 后台才能确认的项目，会单独列出来请你自己确认。

## 文件

技能文件都在 `skills/shopify-launch-check/` 下。

| 文件 | 作用 |
|---|---|
| `SKILL.md` | 入口：需要的信息、三阶段流程、规则 |
| `RECONNAISSANCE.md` | 第一阶段：摸清店铺结构，选样本页 |
| `STOREFRONT.md` | 第二阶段 a：可访问性、首页、分类页、产品页 |
| `CHECKOUT-AND-POLICIES.md` | 第二阶段 b：购物车和结账、政策和信任页、邮件通知 |
| `SEO-AND-PERFORMANCE.md` | 第二阶段 c：SEO、速度、无障碍、手机端 |
| `REGION-AUSTRALIA.md` | 第二阶段 d：澳洲消费者法的价格和退款规则、ATO 税务发票 |
| `REPORTING.md` | 第三阶段：分级标准、Markdown 和 JSON 报告格式 |
| `report-schema.json` | `launch-check-report.json` 的 JSON Schema（draft 2020-12） |
| `validate-report.cjs` | 无依赖的校验脚本，含跨字段检查 |
| `validate-report.test.cjs` | 校验脚本的测试（`node --test`） |

## 安装

安装到当前项目：

```bash
npx skills add https://github.com/DU8866-nice/shopify-launch-check-skill --skill shopify-launch-check
```

安装到个人目录，所有项目可用：

```bash
npx skills add https://github.com/DU8866-nice/shopify-launch-check-skill --skill shopify-launch-check --global
```

更多选项见 `npx skills --help`。

手动安装到 Claude Code：

```bash
git clone https://github.com/DU8866-nice/shopify-launch-check-skill.git
cp -r shopify-launch-check-skill/skills/shopify-launch-check ~/.claude/skills/
```

Claude 应用：把 `skills/shopify-launch-check` 文件夹压缩成 zip，在 Claude 的技能设置里上传。

## 使用

直接用自然语言告诉智能体：

```
帮我检查一下 https://your-store.com.au 能不能上线
```

```
用 shopify-launch-check 检查我的产品页和退款政策，店铺卖到澳洲
```

智能体会先确认店铺网址、销售地区和是否有后台权限，然后按三个阶段检查，写出 `launch-check-report.md` 和 `launch-check-report.json`，并校验 JSON：

```bash
node skills/shopify-launch-check/validate-report.cjs launch-check-report.json
```

## 运行要求

- 支持技能的智能体，比如 Claude Code 或 Claude 应用。
- 能读取网页的工具。手机端检查需要浏览器工具，没有的话会标为"未检查"。
- 运行校验脚本和测试需要 Node.js 18 及以上（可选）。

## 设计原则

- **站在访客角度看。** 店面检查都是顾客能注意到的问题。只有后台能看到的项目交给店主确认，不靠猜。
- **区分亲眼所见和推断。** 每条问题都标明证据类型；严重问题如果只是推断，校验脚本会给出警告。
- **不产生副作用。** 只读页面，最多往购物车加一件商品，绝不下单、订阅或提交表单。
- **小而有代表性的样本。** 大约 15 个覆盖所有模板的页面，比把整个商品目录爬一遍更有效。
- **机器可读的输出。** JSON 报告遵循公开的 schema，可以接入看板、CI 检查或后续的智能体。
- **规则只是提示，不是法律意见。** 地区规则类问题会写明对应的法规，并建议店主以官方来源为准。

## 联系

问题、bug 和新的地区规则文件都欢迎提到 [GitHub Issues](https://github.com/DU8866-nice/shopify-launch-check-skill/issues)。添加新地区：把 `REGION-AUSTRALIA.md` 复制成 `REGION-<国家>.md`，然后提交 PR。

## 许可证

[MIT](LICENSE)
