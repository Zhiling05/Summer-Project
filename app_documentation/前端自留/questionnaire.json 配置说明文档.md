## questionnaire.json 配置说明文档

### 文件结构

questionnaire.json 包含所有问题的配置，每个问题都有固定的结构：

```json
{
  "questions": [
    {
      "id": "Q1",
      "type": "single-choice|multiple-choice", 
      "question": "问题文本",
      "hint": "提示文本",
      "options": ["选项1", "选项2"],
      "navigation": {
        "type": "simple|conditional|cross-question",
        "rules": "...",
        "defaultNext": "..."
      }
    }
  ]
}
```

------

### 配置详解

##### 1. simple 类型 - 简单跳转

场景1：根据答案跳转不同页面

```json
// Q1示例
"navigation": {
  "type": "simple",
  "rules": {
    "Yes": "Q2",    // 选Yes跳Q2
    "No": "Q9"      // 选No跳Q9  
  }
}
```

场景2：无论选什么都跳同一页面

```json
// Q22示例
"navigation": {
  "type": "simple",
  "rules": "URGENT_TO_OPH"  // 不管选Yes还是No都跳这里
}
```



##### 2. conditional 类型 - 条件跳转

用于多选题的特殊逻辑判断

```json
// Q2示例
"navigation": {
  "type": "conditional", 
  "rules": {
    "None of the above": "Q3",                    // 只选了"None of the above"
    "ifAnySymptom": "EMERGENCY_DEPARTMENT"        // 选了任何其他症状
  }
}
```

**逻辑说明：**

- 如果用户只选择了"None of the above" → 跳转到Q3
- 如果用户选择了任何其他选项（不管是否同时选了"None of the above"）→ 跳转到急诊科



##### 3. cross-question 类型 - 跨问题判断

需要参考多个问题的答案来决定跳转

```json
// Q4示例
"navigation": {
  "type": "cross-question",
  "rules": [
    {
      "Q3.hasAnyExcept": "None of the above",     // 规则1：Q3有症状
      "next": "Q14"
    },
    {
      "Q3.includesOnly": "None of the above",     // 规则2：Q3无症状 且 Q4症状≥2个
      "Q4.countExcept": "None of the above",
      "operator": ">=", 
      "value": 2,
      "next": "Q14"
    }
  ],
  "defaultNext": "Q5"                            // 其他情况都跳Q5
}
```

执行顺序：

1. 先检查规则1：Q3是否有除"None of the above"外的选择？有 → 跳Q14
2. 再检查规则2：Q3只选"None of the above" 且 Q4选择≥2个症状？是 → 跳Q14
3. 都不满足 → 跳defaultNext（Q5）

------

### 操作符含义

`ifAnySymptom`: 多选题选择了任何除None of the above之外的症状选项

`hasAnyExcept`: 是否有除指定选项外的任何选择

`includesOnly`: 是否只包含指定选项

`countExcept`: 计算除指定选项外的选择数量

`operator` + `value`: 数值比较（>=, <=, =）