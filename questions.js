window.CPP_INTERVIEW_QUESTIONS = [
  {
    "id": "001",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "什么是 ODR（单一定义规则）？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "同一实体可以有多次声明。但是被 ODR-use 的非 inline 实体通常只能有一个定义。inline 函数、inline 变量和模板可以在多个翻译单元出现等价定义，违反一致性要求会形成未定义行为。",
    "source": "资料依据：cppreference · One Definition Rule"
  },
  {
    "id": "002",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "inline 关键字有什么作用？它一定会内联吗？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "inline 的语言语义主要是允许实体在多个翻译单元中出现等价定义，并不强制机器码展开。是否执行调用内联属于优化决定，编译器可以忽略 inline，也可以内联未标记的函数。面试里要说清楚，inline 解决的是定义可重复出现的问题，真实是否展开由优化器决定。",
    "source": "资料依据：cppreference · inline specifier"
  },
  {
    "id": "003",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "C++ 里的内部链接和外部链接有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "内部链接的名字在每个翻译单元中表示独立实体，外部链接的名字可以在多个翻译单元中指向同一实体。匿名命名空间和命名空间作用域 const 常用于获得内部链接，extern 可以用于声明具有外部链接的实体。",
    "source": "资料依据：cppreference · storage duration and linkage"
  },
  {
    "id": "004",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "extern \"C\" 有什么作用？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "extern \"C\" 指定 C 语言链接，主要影响函数名的链接方式以及实现定义的调用约定。它不会把 C++ 类型、重载或异常自动变成 C ABI 可用形式。因此接口仍然应该限制为双方都能表示的数据布局。",
    "source": "资料依据：cppreference · language linkage"
  },
  {
    "id": "005",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "什么是 ADL（实参依赖查找）？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "对未限定函数调用，ADL 会根据实参类型的关联命名空间和关联类加入候选。它不会作用于限定调用，隐藏友元可以只通过 ADL 被找到。因此泛型代码需要谨慎控制 using 和限定名。写通用 swap、begin 这类扩展点时，常见做法是在局部 using 标准名字，再让 ADL 找到用户自定义重载。",
    "source": "资料依据：cppreference · argument-dependent lookup"
  },
  {
    "id": "006",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "using 声明和 using namespace 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "using 声明把指定名字引入当前作用域，而 using 指令让名字查找考虑整个命名空间。头文件中的 using namespace 会影响所有包含者的候选集，容易造成歧义。所以通常只在局部实现作用域使用。",
    "source": "资料依据：cppreference · namespace using-directives"
  },
  {
    "id": "007",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "constexpr 有什么作用？函数一定在编译期执行吗？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "constexpr 函数具备参与常量求值的资格。但是只有实参和执行路径满足常量表达式规则时才必须在编译期求值。C++14 放宽了函数体限制。不满足常量求值条件的调用仍可以作为普通运行期调用。",
    "source": "资料依据：cppreference · constexpr specifier"
  },
  {
    "id": "008",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "if constexpr 和普通 if 有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "if constexpr 的条件必须可转为常量表达式，未选择的分支会成为 discarded statement。依赖模板参数的丢弃分支不会在该实例中完成实例化。但是分支仍必须满足基本语法并通过非依赖名字检查。",
    "source": "资料依据：cppreference · constexpr if"
  },
  {
    "id": "009",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "auto 类型推导有哪些容易踩坑的地方？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "普通 auto 按模板按值参数的规则推导，会丢弃顶层 cv 和引用。使用 auto&、const auto& 或 auto&& 可以保留相应引用语义，而花括号初始化还可能触发 initializer_list 的特殊规则。",
    "source": "资料依据：cppreference · placeholder type specifiers"
  },
  {
    "id": "010",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "decltype 的推导规则是什么？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "对未加括号的名字或成员访问，decltype 直接得到声明类型。对一般表达式，lvalue 得到 T&、xvalue 得到 T&&、prvalue 得到 T。因此额外括号可能把变量名从 T 变成 T&。",
    "source": "资料依据：cppreference · decltype specifier"
  },
  {
    "id": "011",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "decltype(auto) 有什么用？为什么返回局部变量要小心？",
    "difficulty": 4,
    "scopes": [
      "C++14",
      "C++17"
    ],
    "answer": "decltype(auto) 完全采用 decltype 的规则，return (local) 会推导为局部变量的左值引用。函数返回后该引用悬空，而 return local 通常按声明类型返回值。所以括号会实质改变接口。",
    "source": "资料依据：cppreference · placeholder type specifiers decltype(auto)"
  },
  {
    "id": "012",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "nullptr 比 NULL 好在哪里？",
    "difficulty": 1,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "nullptr 的类型是 std::nullptr_t，可以转换为任意指针和成员指针。但是不会按普通整数参与重载。0 或实现为整数的 NULL 可能选择整型重载，从而产生歧义或调用错误接口。",
    "source": "资料依据：cppreference · pointer literals"
  },
  {
    "id": "013",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "enum class 比普通 enum 好在哪里？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "作用域枚举的枚举值必须通过枚举类型限定访问，并且不会隐式转换为整数。可以显式指定底层类型以控制存储和 ABI。但是跨接口时仍然应该固定编译器和布局约定。工程里更稳妥的做法，是让接口直接表达这些边界，而不是依赖调用方记住隐含前提。",
    "source": "资料依据：cppreference · enumeration declaration"
  },
  {
    "id": "014",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "alignas 有什么作用？能降低类型对齐吗？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "alignas 可以提高对象或类型的对齐要求，不能用更小的非零值削弱自然对齐。多个 alignas 同时出现时采用最严格的有效要求，不满足实现支持范围会使程序不符合规则。如果确实需要更严格对齐，应检查目标平台支持的最大对齐，并让分配方式也满足同样要求。",
    "source": "资料依据：cppreference · alignment specifier"
  },
  {
    "id": "015",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "静态对象初始化顺序问题是什么？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "同一翻译单元内的有序动态初始化按定义顺序进行。但是不同翻译单元之间通常没有可依赖的全局顺序。用函数内静态对象按需初始化可以把依赖关系转移到首次调用，并从 C++11 起获得线程安全初始化。",
    "source": "资料依据：cppreference · non-local initialization"
  },
  {
    "id": "016",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "thread_local 的初始化和析构时机是什么？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "每个线程拥有独立的 thread_local 对象实例，其动态初始化最迟在该线程首次 ODR-use 前完成。实例通常在线程退出时析构，若析构依赖其他已销毁的线程局部或静态对象，仍可能出现顺序问题。",
    "source": "资料依据：cppreference · storage duration thread local"
  },
  {
    "id": "017",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "什么是整型提升？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "bool、char、short 等小整数类型参与大多数算术运算前会提升为 int 或 unsigned int。运算结果类型由提升后的操作数决定。因此溢出和重载选择不能按原始变量类型判断。",
    "source": "资料依据：cppreference · implicit conversions integral promotions"
  },
  {
    "id": "018",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "有符号数和无符号数混用有什么坑？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "通常算术转换可能把有符号操作数转换成同等级的无符号类型，负数随后表现为很大的无符号值。比较前应该统一到能表达双方范围的类型，不能只在结果异常后再做强制转换。因此，写代码时要让类型和初始化形式尽量明确，避免把隐式转换留到重载解析里碰运气。",
    "source": "资料依据：cppreference · usual arithmetic conversions"
  },
  {
    "id": "019",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "什么是窄化转换？列表初始化为什么能拦住它？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "花括号初始化会拒绝可能丢失范围或精度的整型、浮点和浮点到整型转换，只有部分可证明安全的常量表达式例外。这个检查发生在编译期。因此比圆括号初始化更适合暴露隐式截断。例如 int x{3.14} 会被拒绝，而 int x(3.14) 可能只留下警告或直接截断。",
    "source": "资料依据：cppreference · list-initialization narrowing conversions"
  },
  {
    "id": "020",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "initializer_list 为什么容易抢重载？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "列表初始化的重载解析先单独考虑 initializer_list 构造函数，只要存在可行候选就优先选择。即使另一个构造函数看起来参数更精确，也可能直到 initializer_list 阶段失败后才被考虑。",
    "source": "资料依据：cppreference · list-initialization overload resolution"
  },
  {
    "id": "021",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "什么是聚合初始化？C++17 有哪些变化？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "C++17 允许满足聚合条件的类包含公开基类，初始化顺序先基类后成员。未显式提供的成员使用默认成员初始化器或值初始化。但是用户提供构造函数等条件会使类型失去聚合资格。因此，写代码时要让类型和初始化形式尽量明确，避免把隐式转换留到重载解析里碰运气。",
    "source": "资料依据：cppreference · aggregate initialization"
  },
  {
    "id": "022",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "const 引用延长临时对象生命周期有哪些限制？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "临时对象直接绑定到局部 const 引用时，寿命通常延长到该引用的作用域结束。通过函数参数、new 初始化器或返回引用等场景有不同边界，不能把寿命延长沿着另一个引用继续传递。安全说法是只相信直接绑定这一层；一旦经过参数、返回值或成员保存，就要重新检查生命周期。",
    "source": "资料依据：cppreference · reference initialization temporary lifetime"
  },
  {
    "id": "023",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "数组什么时候不会退化成指针？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "数组在大多数值上下文中转换为指向首元素的指针。但是作为 sizeof、alignof、取地址和引用绑定的操作数时不会退化。模板按引用接收数组也能保留长度信息。如果边界没有写清楚，问题通常会表现为重载选错、生命周期错误或窄化转换被拒绝。",
    "source": "资料依据：cppreference · array-to-pointer conversion"
  },
  {
    "id": "024",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "模板按值传参会丢掉哪些类型信息？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "按值形参会复制一个新的对象，模板推导因此忽略实参类型的顶层 cv 限定。指针所指对象的 const 属于低层限定并会保留，按引用形参也能观察原对象的 cv 属性。因此，写代码时要让类型和初始化形式尽量明确，避免把隐式转换留到重载解析里碰运气。",
    "source": "资料依据：cppreference · template argument deduction cv qualifiers"
  },
  {
    "id": "025",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "什么是严格别名规则？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "对象通常只能通过与其动态类型兼容的 glvalue 访问，char、unsigned char 和 std::byte 可以用于检查对象表示。用不相关指针 reinterpret_cast 后解引用可能违反严格别名并导致未定义行为，复制字节应该优先使用 memcpy。",
    "source": "资料依据：cppreference · object type-aliasing"
  },
  {
    "id": "026",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "union 读取非活动成员有什么风险？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "标准通常只允许读取当前活动成员，切换活动成员需要开始新成员的生命周期。某些实现扩展允许类型双关。但是可移植代码应该使用显式转换、memcpy 或 C++17 的 variant。如果边界没有写清楚，问题通常会表现为重载选错、生命周期错误或窄化转换被拒绝。",
    "source": "资料依据：cppreference · union declaration active member"
  },
  {
    "id": "027",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "memcpy 拷贝对象什么时候是安全的？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "对 trivially copyable 类型，可以把对象表示复制到字节数组并复制回来，原值应该得到恢复。把字节解释成另一个不兼容类型仍受生命周期、对齐和别名规则约束，memcpy 不是任意类型转换许可证。",
    "source": "资料依据：cppreference · object representation and trivially copyable types"
  },
  {
    "id": "028",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "C++17 的函数参数求值顺序解决了什么问题？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "C++17 保证不同实参的求值彼此不交错，即一个实参完整求值后才开始另一个。具体先算哪个实参仍通常未指定。所以程序不能依赖从左到右的调用顺序。比如 f(i++, i++) 不再有交错执行的问题，但两个参数谁先自增仍不能作为程序逻辑。",
    "source": "资料依据：cppreference · order of evaluation"
  },
  {
    "id": "029",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "写了析构函数后，移动构造还会自动生成吗？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "用户声明析构函数会抑制隐式移动构造和移动赋值的生成。但是复制操作可能仍存在。资源管理类型应该显式决定五个特殊成员的语义，纯组合类型则优先遵循零法则。如果确实需要移动能力，就显式 default 或自定义移动操作；否则类型可能在容器里退回复制。",
    "source": "资料依据：cppreference · special member functions"
  },
  {
    "id": "030",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "什么是零法则、三法则和五法则？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "零法则把资源所有权交给标准容器和智能指针，使编译器生成的复制、移动和析构自然组合。只有类型直接拥有非 RAII 资源或需要特殊复制语义时，才应该显式实现五法则。因此，类的接口要明确表达所有权、继承关系和对象状态，不能只依赖调用者按约定使用。",
    "source": "资料依据：cppreference · rule of zero"
  },
  {
    "id": "031",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "基类析构函数为什么通常要写成 virtual？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "若基类析构函数非虚，通过基类指针 delete 一个派生对象会产生未定义行为。虚析构保证从最终派生类开始逐层析构。不允许多态删除的基类可采用 protected 非虚析构。回答时可以把它和“是否允许通过基类接口销毁对象”绑定起来说，所有权边界会更清楚。",
    "source": "资料依据：C++ Core Guidelines · virtual destructor"
  },
  {
    "id": "032",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "纯虚析构函数为什么还要有函数体？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "纯虚析构函数可以让类保持抽象。但是派生对象销毁时仍会调用基类析构部分。链接器因此需要找到该析构函数的定义，即使它被声明为 = 0。这也是为什么抽象基类的析构函数常写成 public virtual 或 protected non-virtual，而不是只看 =0。",
    "source": "资料依据：cppreference · pure virtual destructor"
  },
  {
    "id": "033",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "override 和 final 有什么作用？",
    "difficulty": 1,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "override 要求当前声明确实覆盖某个基类虚函数，签名或 cv/ref 限定不匹配会直接报错。final 可以禁止继续覆盖函数或继承类，把设计意图变成编译期约束。因此，类的接口要明确表达所有权、继承关系和对象状态，不能只依赖调用者按约定使用。",
    "source": "资料依据：cppreference · override specifier"
  },
  {
    "id": "034",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "构造函数和析构函数里调用虚函数有什么问题？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "构造或析构某一层基类期间，虚调用只分派到当前正在构造或析构的层次，不会进入尚未构造或已经销毁的派生部分。依赖完整派生状态的逻辑应该放到对象完成构造后的显式阶段。原因是此时对象的动态类型被标准限制在当前层，虚分派不会假装派生部分已经可用。",
    "source": "资料依据：cppreference · virtual function during construction"
  },
  {
    "id": "035",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "什么是对象切片？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "按值构造基类对象只复制派生对象中的基类子对象，派生新增状态被切掉，这就是对象切片。需要保留动态类型时应该使用引用、指针或具备值语义的多态封装。切片后的基类副本已经不是原来的派生对象，虚函数分派也不会再看到派生类状态。",
    "source": "资料依据：C++ Core Guidelines · object slicing"
  },
  {
    "id": "036",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "多重继承出现同名成员怎么办？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "若多个基类都提供同名成员，未限定访问可能产生歧义，即使其中实现完全相同。可以用限定名、using 声明或重新设计公共虚基类来明确选择。但是还要检查转换路径是否唯一。因此，类的接口要明确表达所有权、继承关系和对象状态，不能只依赖调用者按约定使用。",
    "source": "资料依据：cppreference · multiple inheritance"
  },
  {
    "id": "037",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "虚继承里虚基类由谁初始化？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "虚基类只在最终派生对象中存在一个共享子对象，并由最派生类负责初始化。中间类初始化列表中对虚基类的初始化在构造更深派生对象时会被忽略。这样可以避免菱形继承中同一个虚基类被多个中间类重复构造。",
    "source": "资料依据：cppreference · virtual base classes"
  },
  {
    "id": "038",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "standard-layout 和 trivially copyable 是什么？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "standard-layout 约束成员和继承布局，使部分 C 互操作与首成员地址规则成立。trivially copyable 关注对象能否按字节复制，两者相互独立，不能从一个属性推导另一个。",
    "source": "资料依据：cppreference · type properties"
  },
  {
    "id": "039",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "成员变量的初始化顺序由什么决定？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "成员始终按类中声明顺序初始化，基类则先于成员，初始化列表的排列不会改变这个顺序。若一个成员初始化依赖另一个成员，声明顺序错误会导致读取尚未初始化的数据。因此，类的接口要明确表达所有权、继承关系和对象状态，不能只依赖调用者按约定使用。",
    "source": "资料依据：cppreference · constructors initialization order"
  },
  {
    "id": "040",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "什么是 EBO（空基类优化）？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "实现通常允许空基类不占额外空间。但是相同类型的不同子对象仍然需要满足地址可区分等规则。标准只在特定布局关系下提供保证，普通空成员在 C++17 中仍通常占用空间。因此，EBO 适合减少实现细节成本，但不能拿来承诺跨编译器 ABI 布局。",
    "source": "资料依据：cppreference · empty base optimization"
  },
  {
    "id": "041",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "什么是 PImpl（实现指针）？它解决什么问题？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "PImpl 让公开类只持有指向私有实现的指针，调用方无需看到成员布局，修改实现通常不要求重新编译用户代码。析构和移动操作应该在实现类型完整的源文件中定义，并明确跨模块分配释放责任。常见写法是把 unique_ptr<Impl> 放在头文件里，把析构函数、移动构造和移动赋值放到 .cpp 中实现。",
    "source": "资料依据：C++ Core Guidelines · pImpl idiom"
  },
  {
    "id": "042",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "什么是协变返回类型？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "覆盖函数可以把返回的类指针或引用收窄为基类返回类型的派生类指针或引用。该规则不适用于按值返回，也要求目标类型在覆盖点具备可以访问且无歧义的继承转换。因此，类的接口要明确表达所有权、继承关系和对象状态，不能只依赖调用者按约定使用。",
    "source": "资料依据：cppreference · virtual function covariant return"
  },
  {
    "id": "043",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "什么是 RAII（资源获取即初始化）？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "RAII 把资源获取绑定到对象构造，把释放绑定到析构。因此正常返回和栈展开都会执行同一清理路径。资源拥有者必须具备明确的移动或复制语义，析构还应该保持不抛异常。真正要避免的是资源和对象状态分离，因为异常路径和提前返回最容易漏掉这类清理。",
    "source": "资料依据：cppreference · RAII"
  },
  {
    "id": "044",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "C++ 的异常安全保证分哪几级？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "基本保证要求失败后对象仍有效且没有资源泄漏，强保证要求操作要么成功要么保持原状态。不抛保证承诺操作不会传播异常，常用于析构、swap 和移动路径。强保证通常靠先构造新状态再提交，noexcept 移动会影响容器能否维持强保证。",
    "source": "资料依据：cppreference · exception safety"
  },
  {
    "id": "045",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "构造函数抛异常时析构顺序是什么？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "已经完成构造的基类和成员会按逆序析构，尚未完成的最外层对象本身不会调用析构函数。构造函数直接获得的裸资源若未交给已构造成员管理，可能在此路径泄漏。因此，资源管理代码应该把所有权交给对象生命周期，而不是散落在多个手写清理分支里。",
    "source": "资料依据：cppreference · constructors exceptions"
  },
  {
    "id": "046",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "析构函数为什么不应该抛异常？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "若已有异常正在传播，析构函数再让异常逃逸会触发 std::terminate。析构函数默认 noexcept，清理失败通常应被记录、转成状态，或交由显式 close 操作处理。真正要避免的是资源和对象状态分离，因为异常路径和提前返回最容易漏掉这类清理。",
    "source": "资料依据：cppreference · destructors noexcept"
  },
  {
    "id": "047",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "placement new 怎么用？为什么要手动析构？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "placement new 只在给定存储上构造对象，不负责释放存储，也不会自动调用原对象析构。重用非平凡对象的存储前应该结束旧生命周期，并保证对齐、大小和后续访问满足新对象类型。典型写法是先显式调用旧对象析构，再在同一块足够对齐的存储上构造新对象。",
    "source": "资料依据：cppreference · new expression placement new"
  },
  {
    "id": "048",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "std::launder 是解决什么问题的？",
    "difficulty": 5,
    "scopes": [
      "C++17"
    ],
    "answer": "在同一存储中构造新对象后，旧指针有时不能直接用于访问新对象，尤其涉及 const 成员或完整对象替换边界时。std::launder 返回可以用于指向新对象的指针。但是不会修复错误的对齐、生命周期或类型别名。",
    "source": "资料依据：cppreference · std::launder"
  },
  {
    "id": "049",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "返回局部对象或临时对象的引用有什么问题？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "函数返回时局部对象和大多数局部临时对象的生命周期结束，引用本身不会延长它们到调用方。编译器可能接受该代码。但是任何后续解引用都访问已结束生命周期的对象。真正要避免的是资源和对象状态分离，因为异常路径和提前返回最容易漏掉这类清理。",
    "source": "资料依据：cppreference · reference initialization lifetime"
  },
  {
    "id": "050",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "string_view 最常见的悬空问题是什么？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "string_view 不拥有字符存储，只保存指针和长度。源 string 析构、移动或发生重新分配后，已有 view 可能悬空，接口应该让拥有者寿命明显长于所有观察者。最稳妥的接口是让 string_view 只作为短期观察参数使用，不把它保存到比源字符串更长寿的对象里。",
    "source": "资料依据：cppreference · std::basic_string_view"
  },
  {
    "id": "051",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "标准库对象 move 之后还能用吗？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "除非具体类型另有说明，移动后的对象处于有效但未指定状态，可以析构、赋值或调用不依赖特定值的操作。代码不能假设它一定为空，应该在需要确定状态时显式重新赋值。例如移动后的 vector 可以 clear 或重新赋值，但不要把 empty() 的结果当作所有实现都保证的后置条件。",
    "source": "资料依据：cppreference · move constructors moved-from state"
  },
  {
    "id": "052",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "什么是 copy-and-swap 惯用法？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "赋值先在临时对象中完成可能抛异常的复制，成功后再用不抛的 swap 提交状态。复制失败时原对象保持不变，代价是额外临时对象，并且 swap 必须正确处理所有不变量。真正要避免的是资源和对象状态分离，因为异常路径和提前返回最容易漏掉这类清理。",
    "source": "资料依据：cppreference · copy assignment copy-and-swap"
  },
  {
    "id": "053",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "赋值运算符一定要判断自赋值吗？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "良好设计的复制赋值应该在 x = x 时保持正确。但是不一定需要显式比较地址。copy-and-swap 天然处理自赋值。手写先释放后复制的实现则可能必须检测或重新安排顺序。自赋值不是必定要写 if (this == &rhs)，关键是赋值过程不能先破坏自己还要读取的状态。",
    "source": "资料依据：cppreference · copy assignment operator"
  },
  {
    "id": "054",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "new[] 和 delete[] 为什么必须配对？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "数组 new 可能记录元素数量并逐个构造对象，delete[] 才会按逆序析构全部元素并使用匹配的释放机制。把 new[] 与 delete 配对会产生未定义行为，即使元素是基础类型也不能依赖实现偶然可用。",
    "source": "资料依据：cppreference · delete expression arrays"
  },
  {
    "id": "055",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "非虚析构的基类指针 delete 派生对象有什么问题？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "delete 表达式通过静态基类指针释放派生对象时，需要虚析构才能找到最终析构链和正确释放函数。缺少虚析构不仅会漏掉派生成员清理，标准直接把这种删除定义为未定义行为。真正要避免的是资源和对象状态分离，因为异常路径和提前返回最容易漏掉这类清理。",
    "source": "资料依据：cppreference · delete expression polymorphic"
  },
  {
    "id": "056",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "C++17 之前怎么实现 scope guard？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "可以用自定义 RAII guard 在构造时保存清理函数，并在析构时执行，移动时必须确保只有一个活动拥有者。清理函数不应该让异常逃出析构，提交成功后则需要显式 release 取消执行。",
    "source": "资料依据：C++ Core Guidelines · RAII scope guard"
  },
  {
    "id": "057",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "unique_ptr 自定义删除器会影响什么？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "删除器是 unique_ptr 类型的一部分，状态删除器通常会增加对象大小，无状态删除器可能借助空基类优化不占额外空间。移动 unique_ptr 会连同删除器一起转移，释放接口必须与删除器预期的资源来源匹配。",
    "source": "资料依据：cppreference · std::unique_ptr"
  },
  {
    "id": "058",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "unique_ptr<T> 和 unique_ptr<T[]> 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "数组特化使用 delete[] 并提供下标访问，不提供单对象的 operator* 和 operator->。创建数组所有权时必须选择 T[] 类型，不能把 new T[n] 交给 unique_ptr<T>。",
    "source": "资料依据：cppreference · std::unique_ptr array specialization"
  },
  {
    "id": "059",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "为什么推荐 make_unique 而不是直接 new？",
    "difficulty": 2,
    "scopes": [
      "C++14",
      "C++17"
    ],
    "answer": "make_unique 在一个函数调用中完成对象构造和 unique_ptr 建立，避免裸指针暴露在其他可能抛异常的实参求值之间。它还减少重复类型名。但是需要自定义删除器时仍要显式构造 unique_ptr。",
    "source": "资料依据：cppreference · std::make_unique"
  },
  {
    "id": "060",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "shared_ptr 的控制块里有什么？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "控制块通常保存强引用计数、弱引用计数、删除器和可能的分配器，被管理对象不一定与 get() 返回的地址相同。计数操作具有规定的线程安全性。但是多个线程读写被管理对象仍然需要自行同步。",
    "source": "资料依据：cppreference · std::shared_ptr implementation notes"
  },
  {
    "id": "061",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "make_shared 有什么优缺点？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "make_shared 通常把对象和控制块放在一次分配中，减少分配次数并提高局部性。若仍有 weak_ptr 存在，整块存储可能在对象析构后继续保留。它也不能直接接受自定义删除器。",
    "source": "资料依据：cppreference · std::make_shared"
  },
  {
    "id": "062",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "shared_ptr 循环引用怎么解决？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "weak_ptr 不增加强引用计数。因此把环上的非拥有边改为 weak_ptr 后，强引用归零时对象仍可析构。访问前必须调用 lock 获取临时 shared_ptr，并处理对象已经过期的情况。",
    "source": "资料依据：cppreference · std::weak_ptr"
  },
  {
    "id": "063",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "weak_ptr::lock 是怎么保证安全访问的？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "lock 会原子地检查控制块并在对象仍存活时增加强引用计数，成功后返回的 shared_ptr 保证该次使用期间对象不被销毁。它不保护对象内部数据，也不保证下一次 lock 仍会成功。",
    "source": "资料依据：cppreference · std::weak_ptr lock"
  },
  {
    "id": "064",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "shared_ptr 的别名构造是什么？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "别名构造共享另一个 shared_ptr 的控制块，却保存一个不同的观察指针。它可以让成员子对象随宿主一起存活。但是销毁的始终是控制块原本管理的对象，不是 get() 指向的地址。工程上还要把所有权、失效规则和复杂度预期写清楚，否则 STL 代码很容易看着简单却埋下边界问题。",
    "source": "资料依据：cppreference · std::shared_ptr aliasing constructor"
  },
  {
    "id": "065",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "enable_shared_from_this 什么时候能安全使用？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "对象必须已经由兼容的 shared_ptr 建立控制块，enable_shared_from_this 内部的 weak 引用才会被初始化。对栈对象、构造期间尚未托管的对象或存在第二控制块的对象调用 shared_from_this 会失败或破坏所有权。",
    "source": "资料依据：cppreference · std::enable_shared_from_this"
  },
  {
    "id": "066",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "同一个裸指针能交给两个 shared_ptr 吗？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "分别从同一裸指针构造 shared_ptr 会创建两个互不知情的控制块，每个控制块都认为自己拥有删除责任。应从已有 shared_ptr 复制、使用 shared_from_this，或在一个明确工厂中建立唯一控制块。",
    "source": "资料依据：cppreference · std::shared_ptr constructors"
  },
  {
    "id": "067",
    "group": "cpp",
    "category": "cpp/smart-pointers-allocators",
    "title": "shared_ptr 的原子操作解决什么问题？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "atomic_load、atomic_store 等自由函数允许多个线程原子替换和读取同一个 shared_ptr 对象，避免对该句柄本身的数据竞争。它们只同步智能指针值，被管理对象的可变状态仍然需要独立同步。",
    "source": "资料依据：cppreference · atomic operations for shared_ptr"
  },
  {
    "id": "068",
    "group": "cpp",
    "category": "cpp/smart-pointers-allocators",
    "title": "跨 DLL 传智能指针要注意什么？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "不同模块可能使用不同运行库、堆或编译选项，在另一侧直接 delete 会跨越不兼容的分配边界。接口应该携带由分配模块提供的删除器，或暴露成对的创建和销毁函数。因此，智能指针接口要把所有权和删除方式说清楚，尤其不能让分配端和释放端的约定分离。",
    "source": "资料依据：C++ Core Guidelines · resource ownership across ABI"
  },
  {
    "id": "069",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "lvalue、xvalue、prvalue 有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "lvalue 表示有身份且通常可再次访问的对象，xvalue 表示可复用资源的将亡对象，prvalue 用于初始化结果对象。非 const 左值引用只绑定 lvalue，右值引用绑定 xvalue 或 prvalue，const 左值引用可绑定三者。",
    "source": "资料依据：cppreference · value categories"
  },
  {
    "id": "070",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "引用折叠规则是什么？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "只要组合中出现左值引用，T& 与任何 & 或 && 折叠后都是 T&。只有 T&& 与 T&& 组合仍为 T&&，这条规则让转发引用能够保留实参值类别。所以模板里 T&& 只有在参与推导时才是转发引用，写死的某个类型 && 仍只是普通右值引用。",
    "source": "资料依据：cppreference · reference collapsing"
  },
  {
    "id": "071",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "转发引用和右值引用有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "函数模板中形如 T&& 且 T 由该实参推导时是转发引用，auto&& 也遵循类似规则。若 T 已固定、带 const，或不是发生推导的位置，它就是普通右值引用。因此，移动和转发代码要先保护值类别，再谈性能，否则很容易把对象状态或重载选择弄错。",
    "source": "资料依据：cppreference · forwarding references"
  },
  {
    "id": "072",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "std::move 到底做了什么？",
    "difficulty": 1,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "std::move 只是把表达式转换为对应的右值引用类型，从而允许重载选择移动操作。真正的资源转移发生在随后调用的移动构造、移动赋值或其他接收右值的函数中。因此，std::move 用错位置只会允许别人“偷走”对象，并不会让当前这一行自动变快。",
    "source": "资料依据：cppreference · std::move"
  },
  {
    "id": "073",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "std::forward 有什么作用？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "std::forward<T> 根据模板参数 T 把形参恢复为原来的左值或右值类别。T 必须来自转发引用的推导结果，手工指定错误类型可能把左值错误地转换成右值。工程上还要把所有权、失效规则和复杂度预期写清楚，否则 STL 代码很容易看着简单却埋下边界问题。",
    "source": "资料依据：cppreference · std::forward"
  },
  {
    "id": "074",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "const 对象 std::move 后为什么可能还是拷贝？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "std::move(const T) 产生 const T&&，而多数移动构造需要修改源对象并接收 T&&。const 右值无法绑定该重载，重载解析于是选择接收 const T& 的复制构造。",
    "source": "资料依据：cppreference · std::move const objects"
  },
  {
    "id": "075",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "为什么移动构造函数建议标记 noexcept？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "vector 为保持强异常保证，在移动可能抛异常且类型可复制时通常选择复制旧元素。将确实不抛的移动构造标记 noexcept 后，容器可以安全使用移动并避免昂贵复制。所以给移动构造写 noexcept 之前要保证成员移动也不会抛，否则标记错了会把异常变成 terminate。",
    "source": "资料依据：cppreference · move constructor noexcept"
  },
  {
    "id": "076",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "C++17 强制拷贝消除是什么？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "当 prvalue 直接初始化同类型结果对象时，C++17 把它构造在最终存储中，不要求存在可以访问的复制或移动构造。具名局部变量的 NRVO 仍是允许但不强制的优化。因此，return T{} 可以不依赖移动构造可访问，return local 仍要看 NRVO 是否发生。",
    "source": "资料依据：cppreference · copy elision"
  },
  {
    "id": "077",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "什么是 NRVO（命名返回值优化）？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "返回满足条件的自动存储局部对象时，即使表达式是名字，重载解析也会先把它当作右值尝试移动。移动不可行时再尝试复制。但是 NRVO 本身并不由标准强制。因此，移动和转发代码要先保护值类别，再谈性能，否则很容易把对象状态或重载选择弄错。",
    "source": "资料依据：cppreference · copy elision NRVO"
  },
  {
    "id": "078",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "return std::move(local) 为什么可能变慢？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "NRVO 要求返回表达式直接是具名局部对象，包一层 std::move 后表达式变成转换结果，不再满足该形式。编译器仍可以调用移动构造。但是失去了原地构造的机会。所以返回局部对象时通常直接写 return local，让编译器先尝试 NRVO，失败时再走移动。",
    "source": "资料依据：cppreference · copy elision return std::move"
  },
  {
    "id": "079",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "move 之后对象处于什么状态？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "对象仍满足类型不变量，可以安全析构、赋新值，并调用不要求特定旧值的操作。标准没有普遍保证容器一定为空，只有具体类型文档给出的额外后置条件可以依赖。因此，移动和转发代码要先保护值类别，再谈性能，否则很容易把对象状态或重载选择弄错。",
    "source": "资料依据：cppreference · moved-from state"
  },
  {
    "id": "080",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "万能引用构造函数为什么容易抢拷贝构造？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "不受约束的模板 T&& 对某些非 const 左值能形成比 const T& 更好的匹配，从而抢在复制构造前被选择。应该使用 SFINAE 排除本类型及其派生类型，或提供更窄的显式重载。",
    "source": "资料依据：cppreference · forwarding constructor overload resolution"
  },
  {
    "id": "081",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "模板参数有哪些类型？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "类型参数代表一个类型，非类型参数代表满足版本限制的编译期值，模板模板参数代表能按指定形状实例化的模板。选择参数种类应反映调用方需要替换的是类型、值还是类型构造器。例如 vector<T> 用类型参数，array<T, N> 用非类型参数，接受容器模板本身时才需要模板模板参数。",
    "source": "资料依据：cppreference · template parameters"
  },
  {
    "id": "082",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "函数模板推导什么时候会发生退化？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "按值形参推导时，数组和函数会分别退化为指针，顶层 cv 也会被忽略。按引用形参推导可以保留数组长度、函数类型和 cv 限定。因此，模板代码要把替换失败、实例化时机和约束条件分开看，否则错误信息会很难定位。",
    "source": "资料依据：cppreference · template argument deduction"
  },
  {
    "id": "083",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "模板里为什么有时必须写 typename？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "模板定义阶段，依赖限定名默认不被当作类型，除非语法上下文已经明确。typename 告诉解析器该名字在实例化后应该表示类型，类似地调用依赖模板成员时可能需要 template 消歧义符。",
    "source": "资料依据：cppreference · dependent names typename"
  },
  {
    "id": "084",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "什么是两阶段名字查找？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "非依赖名字在模板定义时完成查找，实例化点后来声明的普通重载不会自动加入。依赖调用会在实例化时结合 ADL 查找关联命名空间。因此声明位置和关联类型会改变候选集。因此，模板代码要把替换失败、实例化时机和约束条件分开看，否则错误信息会很难定位。",
    "source": "资料依据：cppreference · two-phase name lookup"
  },
  {
    "id": "085",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "类模板偏特化怎么匹配？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "编译器先找出所有可匹配偏特化，再按类似函数模板偏序的规则选择更专门者。若两个偏特化互不更专门，实例化会产生歧义而不会回退到主模板。写偏特化时要让匹配关系有清楚的包含顺序，避免两个特化都看起来一样具体。",
    "source": "资料依据：cppreference · partial template specialization"
  },
  {
    "id": "086",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "模板全特化为什么要注意 ODR（单一定义规则）？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "全特化必须在第一次会导致对应实例化的使用之前声明，并放在允许的命名空间作用域。跨翻译单元的定义仍受 ODR 约束，头文件定义通常需要 inline 或只保留声明。因此，模板代码要把替换失败、实例化时机和约束条件分开看，否则错误信息会很难定位。",
    "source": "资料依据：cppreference · explicit specialization"
  },
  {
    "id": "087",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "函数模板为什么不能偏特化？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "语言只允许函数模板显式全特化，不允许偏特化。需要按类型族定制行为时通常使用函数重载、类模板偏特化辅助器或 SFINAE。实际工程里常把可偏特化的逻辑放进类模板 trait，再由函数模板调用这个 trait。",
    "source": "资料依据：cppreference · function template overloading"
  },
  {
    "id": "088",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "什么是 SFINAE（替换失败并非错误）？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "只有在模板参数替换的立即上下文中形成的无效类型或表达式才会使候选被丢弃。函数体实例化、访问后的副作用以及已选候选内部的错误不属于 SFINAE，仍会产生诊断。因此，模板代码要把替换失败、实例化时机和约束条件分开看，否则错误信息会很难定位。",
    "source": "资料依据：cppreference · SFINAE"
  },
  {
    "id": "089",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "enable_if 常放在哪里？各有什么问题？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "放在返回类型中不参与普通参数推导。但是构造函数没有可用返回类型。放在默认模板参数中更通用，却要避免多个声明只因默认值不同而被视为同一模板。返回类型形式还可能影响错误信息和重载可读性，模板参数形式更适合构造函数和转换函数。",
    "source": "资料依据：cppreference · std::enable_if"
  },
  {
    "id": "090",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "void_t 有什么用？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "void_t 会把所有有效模板实参映射为 void，若构造某个实参类型失败，所在偏特化会因 SFINAE 被排除。它常与 decltype 和 declval 组合检测成员类型或表达式是否存在。",
    "source": "资料依据：cppreference · std::void_t"
  },
  {
    "id": "091",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "什么是检测惯用法？",
    "difficulty": 4,
    "scopes": [
      "C++17"
    ],
    "answer": "检测器主模板表示替换失败并提供默认类型，使用 void_t 的偏特化在表达式有效时保存 decltype 结果。调用端可读取 value 判断能力，也能读取 type 继续构造后续泛型接口。",
    "source": "资料依据：cppreference · detection idiom"
  },
  {
    "id": "092",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "if constexpr 和 SFINAE（替换失败并非错误）有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "SFINAE 控制函数或特化是否进入候选集，适合约束公开接口。if constexpr 在已经选中的函数体内丢弃不适用分支，适合共享接口后的实现分派。因此，想让无效调用从重载集中消失用 SFINAE；想在同一个已选函数里写分支用 if constexpr。",
    "source": "资料依据：cppreference · constexpr if and SFINAE"
  },
  {
    "id": "093",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "折叠表达式怎么处理空参数包？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "一元折叠只有 &&、|| 和逗号对空包有规定的单位值，其他运算符对空包不成立。二元折叠提供显式初始值。因此可以为加法等操作定义空包结果。因此，模板代码要把替换失败、实例化时机和约束条件分开看，否则错误信息会很难定位。",
    "source": "资料依据：cppreference · fold expressions"
  },
  {
    "id": "094",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "C++17 非类型模板参数能传哪些类型？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "C++17 允许整型、枚举、指针、引用、成员指针和 std::nullptr_t 等作为非类型模板参数。浮点值和普通类类型尚不能直接作为参数，相关对象还要满足链接和常量表达式要求。",
    "source": "资料依据：cppreference · non-type template parameters"
  },
  {
    "id": "095",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "vector 扩容会导致哪些迭代器失效？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "发生重新分配时，所有指向元素的迭代器、指针和引用都会失效。未重新分配的插入仍会使插入点及其后的迭代器失效。因此保留元素地址前要确认容量和操作位置。循环中保存迭代器再插入 vector 很危险，通常要用索引或在 reserve 后重新取得位置。",
    "source": "资料依据：cppreference · std::vector iterator invalidation"
  },
  {
    "id": "096",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "reserve 和 resize 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "reserve 只保证容量至少达到给定值，不改变 size，也不构造新元素。resize 改变元素数量，会构造或销毁元素，并可能因为容量不足触发重新分配。因此，想避免扩容用 reserve，想真正增加元素个数才用 resize，二者影响的对象生命周期不同。",
    "source": "资料依据：cppreference · std::vector capacity"
  },
  {
    "id": "097",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "vector<bool> 为什么特殊？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "vector<bool> 允许按位压缩存储，operator[] 返回代理对象而不是 bool&。依赖真实地址、引用类型或并发独立元素写入的泛型代码不应该假设它与普通 vector<T> 完全一致。",
    "source": "资料依据：cppreference · std::vector bool specialization"
  },
  {
    "id": "098",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "deque 插入删除会让迭代器失效吗？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "deque 的分段存储使首尾插入通常不会移动已有元素。因此元素引用通常保持有效。迭代器可能因内部映射调整而失效，中间插入或删除还可能使更多引用失效，必须按具体操作规则判断。所以 deque 适合两端增长，但如果代码长期保存迭代器，中间插入删除仍要重新取得位置。",
    "source": "资料依据：cppreference · std::deque iterator invalidation"
  },
  {
    "id": "099",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "list::splice 为什么是常数时间？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "splice 重新连接链表节点而不移动或复制元素，同一 allocator 条件满足时可以保持指向被转移元素的迭代器有效。跨不同容器转移后，迭代器归属新的容器，源容器不再包含这些节点。",
    "source": "资料依据：cppreference · std::list splice"
  },
  {
    "id": "100",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "forward_list 为什么有 before_begin？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "单向链表只有指向下一节点的链接，删除当前节点需要持有前驱。before_begin 提供首元素之前的哨兵位置，使头部插入和 erase_after 能使用统一接口。工程上还要把所有权、失效规则和复杂度预期写清楚，否则 STL 代码很容易看着简单却埋下边界问题。",
    "source": "资料依据：cppreference · std::forward_list"
  },
  {
    "id": "101",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "map 的比较函数有什么要求？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "比较器必须满足非自反、非对称和传递性，并让不可互相小于的键形成传递的等价类。违反这些性质会破坏树结构假设，查找、插入结果将不再可靠。常见错误是比较器依赖可变外部状态，或者把 <= 写成 less，这都会让有序容器失去稳定前提。",
    "source": "资料依据：cppreference · Compare named requirement"
  },
  {
    "id": "102",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "unordered_map 的哈希和相等判断要满足什么关系？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "若 KeyEqual 判定两个键等价，Hash 必须为它们产生相同哈希值。否则查找可能进入错误桶。rehash 会改变桶布局并使迭代器失效。但是元素引用和指针通常保持有效。因此，自定义键类型时要同时设计相等和哈希，让二者描述同一种等价关系。",
    "source": "资料依据：cppreference · UnorderedAssociativeContainer requirements"
  },
  {
    "id": "103",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "vector 和 list 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++17"
    ],
    "answer": "vector 连续存储，随机访问是常数时间，尾部追加通常是摊还常数时间。但是中间插入删除需要移动元素并可能使迭代器失效。list 是节点式存储，不支持随机访问，已知位置插入删除为常数时间。但是缓存局部性和额外指针开销更差。面试中通常先看访问模式：遍历和随机访问多选 vector，频繁在中间稳定位置 splice 或 erase 才考虑 list。",
    "source": "资料依据：cppreference · std::vector；cppreference · std::list"
  },
  {
    "id": "104",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "std::sort 是稳定排序吗？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "std::sort 不保证等价元素的相对顺序。std::stable_sort 保持等价元素的相对顺序，通常需要额外内存或更高的常数开销。等价元素的顺序需要保留时，可以考虑 stable_sort。",
    "source": "资料依据：cppreference · std::sort；cppreference · std::stable_sort"
  },
  {
    "id": "105",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "迭代器分哪几类？它们和算法有什么关系？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "输入迭代器只保证单遍读取，前向迭代器支持多遍，双向迭代器增加递减，随机访问迭代器支持常数时间跳转。算法根据最低类别决定可用操作和复杂度，伪造更强类别会破坏契约。例如 sort 需要随机访问迭代器，list 不能直接调用 std::sort，只能使用自己的成员 sort。",
    "source": "资料依据：cppreference · iterator concepts legacy categories"
  },
  {
    "id": "106",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "什么是 erase-remove 惯用法？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "remove 只把保留元素前移并返回新的逻辑结尾，不会改变容器 size。随后调用容器 erase 才真正销毁尾部多余元素。关联容器则应该使用自身的 erase 接口。工程上还要把所有权、失效规则和复杂度预期写清楚，否则 STL 代码很容易看着简单却埋下边界问题。",
    "source": "资料依据：cppreference · erase-remove idiom"
  },
  {
    "id": "107",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "emplace_back 一定比 push_back 快吗？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "emplace_back 在容器存储中直接用实参构造元素。但是若调用方已经有一个 T 对象，push_back(T&&) 同样可以移动构造。emplace 还可能接受意外的隐式构造参数，性能和可读性应该按实际调用比较。",
    "source": "资料依据：cppreference · std::vector emplace_back"
  },
  {
    "id": "108",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "标准容器的时间复杂度怎么看？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "不同接口给出的保证不同，例如 vector::push_back 通常是摊还常数，而 map 查找是对数复杂度。unordered 容器常给平均常数和最坏线性保证，设计时必须阅读具体操作的复杂度条款。",
    "source": "资料依据：cppreference · container library requirements complexity"
  },
  {
    "id": "109",
    "group": "cpp",
    "category": "cpp/lambdas-utility-types",
    "title": "lambda 值捕获和引用捕获有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "按值捕获把当时的值存进闭包，闭包寿命独立于原局部变量。按引用捕获只保存引用关系。若闭包逃出作用域或跨线程执行，引用捕获很容易悬空。因此，使用这些工具类型时要明确捕获、所有权和空状态，避免把便利语法当成没有成本的包装。",
    "source": "资料依据：cppreference · lambda capture"
  },
  {
    "id": "110",
    "group": "cpp",
    "category": "cpp/lambdas-utility-types",
    "title": "lambda 怎么捕获 move-only 对象？",
    "difficulty": 2,
    "scopes": [
      "C++14",
      "C++17"
    ],
    "answer": "初始化捕获允许在捕获列表中定义闭包成员，例如 p = std::move(ptr)。该成员随闭包移动或销毁，不再依赖原局部变量。因此可以安全转移 unique_ptr 所有权。因此，使用这些工具类型时要明确捕获、所有权和空状态，避免把便利语法当成没有成本的包装。",
    "source": "资料依据：cppreference · lambda init-capture"
  },
  {
    "id": "111",
    "group": "cpp",
    "category": "cpp/lambdas-utility-types",
    "title": "泛型 lambda 是怎么实现的？",
    "difficulty": 3,
    "scopes": [
      "C++14",
      "C++17"
    ],
    "answer": "泛型 Lambda 的 operator() 是函数模板，auto 形参分别参与模板参数推导。每组实参类型会形成相应实例，值类别要用 auto&& 与 std::forward 才能保留。",
    "source": "资料依据：cppreference · generic lambda"
  },
  {
    "id": "112",
    "group": "cpp",
    "category": "cpp/lambdas-utility-types",
    "title": "lambda 里的 mutable 有什么作用？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "Lambda 的 operator() 默认是 const。因此不能修改普通按值捕获成员。mutable 移除该 const 限定，只改变闭包内部副本，不会反向修改原变量。因此，使用这些工具类型时要明确捕获、所有权和空状态，避免把便利语法当成没有成本的包装。",
    "source": "资料依据：cppreference · lambda mutable"
  },
  {
    "id": "113",
    "group": "cpp",
    "category": "cpp/lambdas-utility-types",
    "title": "无捕获 lambda 能转成函数指针吗？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "无捕获 Lambda 可以转换为具有兼容参数和返回类型的函数指针。带捕获闭包需要对象状态，无法转换成普通函数指针，通常改用模板回调或 std::function。工程上要把对象是否仍然有效说清楚，尤其是回调、延迟执行和类型擦除场景。",
    "source": "资料依据：cppreference · lambda function pointer conversion"
  },
  {
    "id": "114",
    "group": "cpp",
    "category": "cpp/lambdas-utility-types",
    "title": "回调里捕获 this 有什么风险？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "捕获 this 只保存裸指针，不会延长所属对象生命周期。异步执行前对象若已销毁，成员访问会产生未定义行为，应捕获受控所有权或 weak_ptr 并在回调中提升检查。因此，使用这些工具类型时要明确捕获、所有权和空状态，避免把便利语法当成没有成本的包装。",
    "source": "资料依据：cppreference · lambda capture this"
  },
  {
    "id": "115",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "std::function 为什么有额外开销？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "std::function 通过统一调用接口保存不同可以调用对象，可能产生间接调用和动态分配。它要求目标可复制，移动专用闭包不能直接放入 C++17 的 std::function。",
    "source": "资料依据：cppreference · std::function"
  },
  {
    "id": "116",
    "group": "cpp",
    "category": "cpp/lambdas-utility-types",
    "title": "std::invoke 是干什么的？",
    "difficulty": 2,
    "scopes": [
      "C++17"
    ],
    "answer": "std::invoke 能调用函数对象、函数指针和成员指针，并按规则解引用对象、引用包装器或指针。invoke_result 等 traits 使用同一调用语义，避免泛型代码手写成员指针分支。",
    "source": "资料依据：cppreference · std::invoke"
  },
  {
    "id": "117",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "optional 比用特殊值返回好在哪里？",
    "difficulty": 2,
    "scopes": [
      "C++17"
    ],
    "answer": "optional 在对象内部保存是否已构造 T 的状态，无值时不会存在一个可以访问的 T。value 在无值时抛 bad_optional_access，value_or 则返回值或提供的后备值。",
    "source": "资料依据：cppreference · std::optional"
  },
  {
    "id": "118",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "variant 和 any 有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "variant 的备选类型集合在编译期固定，可用 visit 做封闭分派并获得静态类型检查。any 可保存任意满足要求的类型，通过 any_cast 在运行期检查，灵活性更高但无法枚举完整状态集合。",
    "source": "资料依据：cppreference · std::variant and std::any"
  },
  {
    "id": "119",
    "group": "cpp",
    "category": "cpp/exceptions-rtti",
    "title": "C++ 异常为什么建议按值抛出、按 const 引用捕获？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "按值抛出会把异常对象复制或移动到异常存储，避免引用局部对象。按 const 引用捕获不会再次复制，并能通过虚函数保留派生异常的动态行为而避免切片。这类机制解决的是运行时类型和错误传播问题，接口需要明确哪些情况会传播、哪些情况必须本地处理。",
    "source": "资料依据：cppreference · throw expression and catch handler"
  },
  {
    "id": "120",
    "group": "cpp",
    "category": "cpp/exceptions-rtti",
    "title": "catch 的顺序为什么要从派生类到基类？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "处理器按源代码顺序匹配，第一个可处理异常类型的 catch 会被选择。若基类处理器在前，它会截获派生异常，使更具体的处理器永远不可达。这类机制解决的是运行时类型和错误传播问题，接口需要明确哪些情况会传播、哪些情况必须本地处理。",
    "source": "资料依据：cppreference · catch handler matching"
  },
  {
    "id": "121",
    "group": "cpp",
    "category": "cpp/exceptions-rtti",
    "title": "什么是栈展开？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "从抛出点到匹配处理器之间，已经完成构造的自动对象按构造的逆序析构。动态分配但未交给 RAII 对象的资源不会自动释放。因此异常安全依赖所有权对象。因此，异常和 RTTI 代码要把失败边界写清楚，不能让错误处理依赖调用栈上的偶然顺序。",
    "source": "资料依据：cppreference · stack unwinding"
  },
  {
    "id": "122",
    "group": "cpp",
    "category": "cpp/exceptions-rtti",
    "title": "noexcept 函数抛出异常会发生什么？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "异常若试图越过 noexcept 函数边界，运行时调用 std::terminate，而不是把它交给外层 catch。noexcept 应只标在确实能兑现承诺的操作上，并会影响容器选择移动还是复制。",
    "source": "资料依据：cppreference · noexcept specification"
  },
  {
    "id": "123",
    "group": "cpp",
    "category": "cpp/exceptions-rtti",
    "title": "析构函数里清理失败怎么处理？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "析构函数不适合传播错误，因为它可能在另一个异常的栈展开中执行。需要报告失败的资源应该提供显式 close 或 commit 操作，析构只做不抛的兜底清理。因此，异常和 RTTI 代码要把失败边界写清楚，不能让错误处理依赖调用栈上的偶然顺序。",
    "source": "资料依据：C++ Core Guidelines · destructor exception safety"
  },
  {
    "id": "124",
    "group": "cpp",
    "category": "cpp/exceptions-rtti",
    "title": "dynamic_cast 失败时指针和引用有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "对指针做运行期向下或横向转换失败会返回 nullptr。对引用转换失败会抛 std::bad_cast，且源类型必须是多态类型才能执行需要运行期检查的转换。这类机制解决的是运行时类型和错误传播问题，接口需要明确哪些情况会传播、哪些情况必须本地处理。",
    "source": "资料依据：cppreference · dynamic_cast conversion"
  },
  {
    "id": "125",
    "group": "cpp",
    "category": "cpp/exceptions-rtti",
    "title": "typeid 对多态对象返回什么结果？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "当操作数是多态类型的 glvalue 时，typeid 返回实际最派生对象的 type_info。对非多态表达式只反映静态类型。解引用空的多态指针作为操作数会抛 std::bad_typeid。",
    "source": "资料依据：cppreference · typeid operator"
  },
  {
    "id": "126",
    "group": "cpp",
    "category": "cpp/exceptions-rtti",
    "title": "C++ 异常跨动态库有什么风险？",
    "difficulty": 5,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "异常对象布局、RTTI、运行库和展开机制都必须在模块间兼容。否则匹配和销毁可能失败。稳定插件接口通常不让异常跨边界，而是在边界内捕获并转换成错误码或结果对象。这类机制解决的是运行时类型和错误传播问题，接口需要明确哪些情况会传播、哪些情况必须本地处理。",
    "source": "资料依据：C++ Core Guidelines · exceptions across ABI"
  },
  {
    "id": "127",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "std::thread 析构前为什么必须 join 或 detach？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "joinable 的 std::thread 在析构时会直接调用 std::terminate，防止后台线程静默失去所有权。所有控制路径都必须 join、detach 或把线程交给能保证收尾的 RAII 包装。",
    "source": "资料依据：cppreference · std::thread destructor"
  },
  {
    "id": "128",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "mutex、recursive_mutex、timed_mutex 有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "mutex 提供基本互斥，recursive_mutex 允许同一线程重复加锁但容易掩盖重入设计问题，timed_mutex 增加超时尝试。默认应选择最简单的 mutex，只有明确协议需要时再扩大能力。",
    "source": "资料依据：cppreference · mutex types"
  },
  {
    "id": "129",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "lock_guard 和 unique_lock 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "lock_guard 在构造时加锁并在析构时解锁，状态简单且不能中途释放。unique_lock 可延迟、尝试、转移和临时解锁，是 condition_variable 等需要操作锁状态的接口所要求的类型。",
    "source": "资料依据：cppreference · std::unique_lock"
  },
  {
    "id": "130",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "多把锁怎么避免死锁？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "std::lock 使用避免死锁的算法尝试获取一组 Lockable 对象，而不是让调用方按不一致顺序逐个加锁。成功后仍要用 adopt_lock 的 RAII 包装接管每把锁，异常时释放已获得的锁。",
    "source": "资料依据：cppreference · std::lock"
  },
  {
    "id": "131",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "scoped_lock 有什么作用？",
    "difficulty": 2,
    "scopes": [
      "C++17"
    ],
    "answer": "scoped_lock 接收多把互斥量时使用与 std::lock 等价的死锁避免机制，并在析构时统一释放。它不可手动解锁，适合整个作用域都持锁的多锁临界区。如果只需要在一部分代码里提前释放某把锁，就不适合用 scoped_lock 包住整个作用域。",
    "source": "资料依据：cppreference · std::scoped_lock"
  },
  {
    "id": "132",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "condition_variable 为什么要配合谓词循环？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "条件变量允许虚假唤醒，通知到达也不保证业务条件仍成立。wait(lock, predicate) 会在持锁状态检查谓词并在不满足时继续等待，从而把共享状态而非通知次数作为依据。并发代码还要写出明确的同步关系，否则一次测试通过并不能证明不存在数据竞争。",
    "source": "资料依据：cppreference · std::condition_variable wait"
  },
  {
    "id": "133",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "什么是丢失唤醒？怎么避免？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "条件状态必须存放在受同一 mutex 保护的共享变量中，等待方先检查状态再原子地释放锁并阻塞。通知本身不保存历史，只有状态谓词能让后来开始等待的线程观察已经发生的事件。典型写法是 wait(lock, predicate)，谓词为真才继续执行，notify 只负责唤醒检查谓词的线程。",
    "source": "资料依据：cppreference · condition variable lost wakeup"
  },
  {
    "id": "134",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "什么是数据竞争？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "两个线程并发访问同一内存位置、至少一个写入且没有 happens-before 关系时形成数据竞争。除原子对象外，数据竞争使整个程序行为未定义，不能依赖硬件上看似原子的读写。所以只靠“机器上读写好像是原子的”不够，必须用 mutex、atomic 或其他同步手段建立顺序。",
    "source": "资料依据：cppreference · memory model data races"
  },
  {
    "id": "135",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "memory_order_relaxed 能保证什么？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "relaxed 操作保证该原子对象自身的修改顺序和读写原子性，不建立其他普通内存访问的跨线程同步。它适合独立计数等场景，不能单独发布另一个对象的初始化结果。并发代码还要写出明确的同步关系，否则一次测试通过并不能证明不存在数据竞争。",
    "source": "资料依据：cppreference · std::memory_order relaxed"
  },
  {
    "id": "136",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "release/acquire 内存序解决什么问题？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "线程在 release 操作之前的写入，对读取同一值并执行 acquire 操作的线程可见。同步只在 acquire 实际读到 release 序列中的值时建立，操作不同原子或读到旧值都不满足条件。",
    "source": "资料依据：cppreference · std::memory_order acquire release"
  },
  {
    "id": "137",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "顺序一致 memory_order_seq_cst 保证什么？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "memory_order_seq_cst 除 acquire/release 语义外，还要求所有顺序一致操作可放入一个与各线程程序顺序一致的单一总序。它更易推理。但是可能限制某些架构上的优化。",
    "source": "资料依据：cppreference · std::memory_order sequentially-consistent"
  },
  {
    "id": "138",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "promise 不设置结果就销毁会发生什么？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "promise 在共享状态仍然需要要结果时被销毁，会把 broken_promise 异常存入共享状态。future::get 随后抛出 future_error，并且 get 通常只能消费结果一次。",
    "source": "资料依据：cppreference · std::promise"
  },
  {
    "id": "139",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "std::async 的 async 和 deferred 有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "launch::async 允许任务在独立线程异步执行，launch::deferred 则到 wait 或 get 时才在等待线程运行。未显式指定策略时实现可以选择，两种行为对并发度和异常时机都有影响。",
    "source": "资料依据：cppreference · std::async"
  },
  {
    "id": "140",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "call_once 有什么作用？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "多个线程对同一 once_flag 调用 call_once 时，只有一个成功返回的执行被记为完成，其他线程随后观察其效果。若初始化函数抛异常，标志不会完成，后续调用可以再次尝试。",
    "source": "资料依据：cppreference · std::call_once"
  },
  {
    "id": "141",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "返回 string_view 要注意什么生命周期问题？",
    "difficulty": 2,
    "scopes": [
      "C++17"
    ],
    "answer": "string_view 不拥有字符数据，返回它只安全于底层存储在调用方使用期间持续有效。不能返回指向局部 string、临时拼接结果或随后可能扩容的缓冲区的 view。如果要跨作用域保存结果，应返回 string 或让调用方传入并持有底层缓冲区。",
    "source": "资料依据：cppreference · std::basic_string_view"
  },
  {
    "id": "142",
    "group": "cpp",
    "category": "cpp/strings-time-files-streams",
    "title": "C++17 的 std::string::data 能修改吗？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "C++17 为非 const string 提供返回 char* 的 data，可以在不改变 size 的前提下修改已有字符。写越过 size、破坏结尾空字符约束或把指针保留到会失效的修改之后仍然不合法。",
    "source": "资料依据：cppreference · std::basic_string data"
  },
  {
    "id": "143",
    "group": "cpp",
    "category": "cpp/strings-time-files-streams",
    "title": "std::string 的小字符串优化是标准保证的吗？",
    "difficulty": 1,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "标准没有要求 small string optimization，也不规定阈值或对象布局。代码不能根据短字符串假设零分配，性能判断应该基于目标标准库和实测。因此，用 string 优化热路径时要看实际库和数据分布，不能把 SSO 当成接口契约。",
    "source": "资料依据：cppreference · std::basic_string implementation notes"
  },
  {
    "id": "144",
    "group": "cpp",
    "category": "cpp/strings-time-files-streams",
    "title": "std::string 和字符编码有什么关系？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "std::string 只是 char 序列，不记录编码，也不会验证 UTF-8。接口必须约定字节编码和错误处理，按字符截断、大小写转换或索引时还要区分字节、码点和用户感知字符。这类接口看起来日常，但边界条件往往来自环境差异和状态保持，所以需要把前提说完整。",
    "source": "资料依据：cppreference · strings and encodings"
  },
  {
    "id": "145",
    "group": "cpp",
    "category": "cpp/strings-time-files-streams",
    "title": "filesystem::path 怎么处理不同平台路径？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "path 保存平台原生路径格式，并提供 generic 格式用于跨平台表达。路径拼接应该使用 operator/，字符串编码转换和根目录语义仍取决于平台，失败可以通过异常或 error_code 重载报告。",
    "source": "资料依据：cppreference · std::filesystem::path"
  },
  {
    "id": "146",
    "group": "cpp",
    "category": "cpp/strings-time-files-streams",
    "title": "system_clock 和 steady_clock 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "system_clock 可与日历时间互转。但是可能因系统校时向前或向后跳变。steady_clock 保证单调递增，更适合测量超时和耗时，不能直接当作墙上时间显示。这类接口看起来日常，但边界条件往往来自环境差异和状态保持，所以需要把前提说完整。",
    "source": "资料依据：cppreference · chrono clocks"
  },
  {
    "id": "147",
    "group": "cpp",
    "category": "cpp/strings-time-files-streams",
    "title": "chrono::duration 的类型转换有什么规则？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "从细粒度到粗粒度且不能保证整除的转换可能截断。因此通常需要 duration_cast 显式表达。反向扩大精度在表示类型兼容时可隐式完成。但是还要考虑计数值溢出。例如 milliseconds 到 seconds 可能丢掉余数，seconds 到 milliseconds 扩大精度时通常更安全。",
    "source": "资料依据：cppreference · std::chrono::duration"
  },
  {
    "id": "148",
    "group": "cpp",
    "category": "cpp/strings-time-files-streams",
    "title": "eofbit、failbit、badbit 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "eofbit 表示输入序列到达末尾，failbit 表示格式化提取失败，badbit 表示底层 I/O 等严重错误。状态位可以同时存在，clear 只重置状态，不会自动修复数据源或回退已消费输入。",
    "source": "资料依据：cppreference · std::ios_base iostate"
  },
  {
    "id": "149",
    "group": "cpp",
    "category": "cpp/strings-time-files-streams",
    "title": "自定义 streambuf 要实现哪些核心函数？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "underflow 在读区无可用字符时补充或报告输入，overflow 在写区满或显式同步时提交输出。实现必须维护 get/put 区指针、EOF 约定和所有权，错误状态最终由上层流对象观察。",
    "source": "资料依据：cppreference · std::basic_streambuf"
  },
  {
    "id": "150",
    "group": "cpp",
    "category": "cpp/strings-time-files-streams",
    "title": "std::regex 为什么性能可能不适合高频解析？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "标准规定匹配语义和接口。但是没有统一保证实现算法、编译缓存或最坏时间复杂度。对输入可控性和延迟敏感的场景应该测量目标标准库，并考虑专用解析器或受限模式。因此，日志、协议或大量文本解析更常见的选择是手写状态机、专用库或先限制正则模式。",
    "source": "资料依据：cppreference · regular expressions library"
  },
  {
    "id": "151",
    "group": "gof",
    "category": "gof/creation",
    "title": "Abstract Factory 如何创建一组相互匹配的产品？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "抽象工厂定义创建相关产品族的接口，让客户端只依赖抽象产品并保持同一族的兼容性。它适合产品族会整体替换的场景。但是新增一种产品会迫使工厂接口及各具体工厂一起扩展。客户端只关心拿到的产品能配套工作，不需要知道具体工厂创建了哪个平台或主题的实现。",
    "pattern": "Abstract Factory",
    "source": "资料依据：GoF · GoF Abstract Factory intent and product-family consistency"
  },
  {
    "id": "152",
    "group": "gof",
    "category": "gof/creation",
    "title": "切换 Abstract Factory 产品族时依赖应放在哪里？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "客户端应依赖抽象工厂，具体工厂在组合根或配置边界被选择。同一工厂负责产生彼此匹配的产品。这样切换主题只替换工厂实现，代价是产品种类固定后扩展新产品需要修改全部工厂。如果创建过程并不复杂，直接构造通常比套用模式更清楚。",
    "pattern": "Abstract Factory",
    "source": "资料依据：GoF · GoF Abstract Factory intent and product-family consistency"
  },
  {
    "id": "153",
    "group": "gof",
    "category": "gof/structural",
    "title": "Adapter 如何把旧接口转换为客户端期待的接口？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "适配器实现客户端所需的 Target 接口，并把调用转换给已有 Adaptee。对象适配器用组合保存被适配对象。转换层应集中处理参数、错误和所有权差异，避免把旧接口细节泄漏到客户端。",
    "pattern": "Adapter",
    "source": "资料依据：GoF · GoF Adapter object and class adapters"
  },
  {
    "id": "154",
    "group": "gof",
    "category": "gof/structural",
    "title": "对象 Adapter 与类 Adapter 如何选择？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "对象适配器通过组合可适配多个对象，运行时可替换且不受单继承限制。类适配器依赖多重继承并能直接覆盖受保护行为。C++ 中优先组合，只有需要静态复用实现且继承关系稳定时才考虑类适配器。",
    "pattern": "Adapter",
    "source": "资料依据：GoF · GoF Adapter object and class adapters"
  },
  {
    "id": "155",
    "group": "gof",
    "category": "gof/structural",
    "title": "Bridge 如何拆开抽象层和实现层的变化轴？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "桥接把抽象层的操作接口与实现层的细节放在两个独立继承层次，并由抽象持有实现接口。两条变化轴可独立扩展，代价是多一个间接层和更复杂的对象装配。若只有一个稳定实现，普通继承更简单。如果只是简单转发，模式本身可能会让代码比问题更复杂。",
    "pattern": "Bridge",
    "source": "资料依据：GoF · GoF Bridge abstraction-implementation separation"
  },
  {
    "id": "156",
    "group": "gof",
    "category": "gof/structural",
    "title": "Bridge 的实现对象由谁拥有和替换？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "实现对象通常由抽象端以唯一所有权或共享策略持有，构造时注入，必要时通过受控接口替换。替换必须保证旧实现上的未完成操作和资源先收尾。否则桥接只隐藏了生命周期错误而没有解决它。判断是否使用结构型模式时，要看对象之间的组合边界是否需要稳定下来，而不是只看类图是否复杂。",
    "pattern": "Bridge",
    "source": "资料依据：GoF · GoF Bridge abstraction-implementation separation"
  },
  {
    "id": "157",
    "group": "gof",
    "category": "gof/creation",
    "title": "Builder 如何分离复杂对象的构造步骤？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "Builder 将构造步骤从最终产品表示中分离，Director 可按固定顺序调用步骤而不暴露内部布局。产品有许多可选部件或需多种表示时适用。简单对象使用构造函数或工厂更直接。它的好处不是“多一个构造器”，而是把构造顺序、校验和最终表示分开管理。",
    "pattern": "Builder",
    "source": "资料依据：GoF · GoF Builder construction process and representation"
  },
  {
    "id": "158",
    "group": "gof",
    "category": "gof/creation",
    "title": "可复用 Builder 怎样避免上一次状态泄漏？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "可复用 Builder 必须在开始新构造时清空产品或创建新的产品实例，并明确哪些配置是默认值。复用同一实例若不重置会把前一次选项带入后续结果。不可变 Builder 或一次性 Builder 能减少这种状态污染。",
    "pattern": "Builder",
    "source": "资料依据：GoF · GoF Builder construction process and representation"
  },
  {
    "id": "159",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Chain of Responsibility 如何沿处理者链传递请求？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "责任链把请求沿一组可替换处理者传递，每个处理者决定处理或交给后继者，发送者不依赖具体接收者。链适合运行时组合处理步骤。但是请求可能无人处理或顺序敏感。因此应定义终止处理者和可观察的拒绝结果。",
    "pattern": "Chain of Responsibility",
    "source": "资料依据：GoF · GoF Chain of Responsibility successor handling"
  },
  {
    "id": "160",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "处理者链如何表达处理、继续和拒绝三种结果？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "处理者接口应该明确返回已处理、继续传递或拒绝并报错等结果，不能只依赖隐含的副作用。调用端据此决定是否继续链、记录未处理请求或触发降级。链越长，调试和最坏延迟越难控制。这样新增处理步骤时主要调整链的组合，调用端不用知道每个处理者的内部判断。",
    "pattern": "Chain of Responsibility",
    "source": "资料依据：GoF · GoF Chain of Responsibility successor handling"
  },
  {
    "id": "161",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Command 如何把一次操作封装成可排队对象？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "命令对象把接收者、操作参数和执行入口封装起来，使调用者能把请求排队、记录或延迟执行。队列拥有命令对象的生命周期，接收者只负责实际业务。异步队列还要定义取消、失败和重试语义。如果只是一次普通同步调用，直接调用接收者方法更清楚。",
    "pattern": "Command",
    "source": "资料依据：GoF · GoF Command request encapsulation and undo"
  },
  {
    "id": "162",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "支持撤销时 Command 需要保存哪些状态？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "可撤销命令需要保存执行前足以恢复不变量的状态，或设计可逆的反向操作。只保存“上一步”标志通常不够。外部资源和并发副作用难以回滚，命令应限制事务边界并说明撤销失败如何处理。判断是否使用行为型模式时，要看变化的是算法、状态还是对象之间的通知关系。",
    "pattern": "Command",
    "source": "资料依据：GoF · GoF Command request encapsulation and undo"
  },
  {
    "id": "163",
    "group": "gof",
    "category": "gof/structural",
    "title": "Composite 如何让叶子和组合对象共享操作接口？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "组合模式把叶子与容器放进同一组件接口，客户端可对单个对象和整棵部分—整体树使用相同操作。透明接口便于递归处理但可能让叶子暴露无意义的 add/remove。安全接口则需在易用性与类型检查之间取舍。",
    "pattern": "Composite",
    "source": "资料依据：GoF · GoF Composite part-whole hierarchy"
  },
  {
    "id": "164",
    "group": "gof",
    "category": "gof/structural",
    "title": "Composite 遍历子节点时如何处理生命周期？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "组合对象应该明确子节点的所有权，拥有型树可以由父节点通过 RAII 管理，观察型关系则不能在遍历时假定子节点仍存活。删除或移动节点时必须使迭代器、父指针和缓存失效规则一致。否则递归访问会读到悬空对象。",
    "pattern": "Composite",
    "source": "资料依据：GoF · GoF Composite part-whole hierarchy"
  },
  {
    "id": "165",
    "group": "gof",
    "category": "gof/creation",
    "title": "Abstract Factory 与 Builder 如何共同构造可配置产品？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "抽象工厂先决定兼容的产品族，Builder 再按步骤配置该族中的一个复杂产品。两者的边界分别是“选哪一族”和“怎样组装”。组合能同时支持主题替换与可选部件。但是接口数量、测试夹具和装配代码都会增加。",
    "pattern": "Cross-pattern",
    "source": "资料依据：GoF · GoF pattern relationships and creation tradeoffs"
  },
  {
    "id": "166",
    "group": "gof",
    "category": "gof/creation",
    "title": "Factory Method 与 Prototype 在复制和创建之间如何选择？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "Factory Method 通过虚拟创建钩子让派生类决定新对象，Prototype 则复制已配置实例以绕过具体构造过程。构造成本高且类型在运行时注册时适合原型。复制语义不清或资源不可复制时，工厂方法更容易维持不变量。",
    "pattern": "Cross-pattern",
    "source": "资料依据：GoF · GoF pattern relationships and creation tradeoffs"
  },
  {
    "id": "167",
    "group": "gof",
    "category": "gof/structural",
    "title": "Decorator 如何在不修改原类的情况下叠加职责？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "装饰器实现与被装饰对象相同的接口，并在转发调用前后附加职责。因此可以运行时叠加功能而不修改原类。它适合职责组合细粒度变化，代价是调用链变长、调试困难，且装饰器顺序可能改变结果。如果只是简单转发，模式本身可能会让代码比问题更复杂。",
    "pattern": "Decorator",
    "source": "资料依据：GoF · GoF Decorator dynamic responsibility attachment"
  },
  {
    "id": "168",
    "group": "gof",
    "category": "gof/structural",
    "title": "多层 Decorator 的析构与异常传播如何保证？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "每层装饰器应以 RAII 管理自己拥有的下层对象，并让析构保持不抛。异常从转发调用向外传播时不能跳过已构造层的清理。若某层需要吞掉或转换异常，边界必须写入接口契约。否则多层包装会掩盖失败来源。",
    "pattern": "Decorator",
    "source": "资料依据：GoF · GoF Decorator dynamic responsibility attachment"
  },
  {
    "id": "169",
    "group": "gof",
    "category": "gof/structural",
    "title": "Facade 如何为多个子系统提供稳定入口？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "外观为一组子系统提供面向用例的窄接口，隐藏初始化顺序和协作细节。但是不替子系统定义新的业务模型。它降低调用方耦合，代价是外观可能膨胀成上帝对象。复杂用例应拆成多个门面或保留受控的子系统访问。",
    "pattern": "Facade",
    "source": "资料依据：GoF · GoF Facade subsystem interface"
  },
  {
    "id": "170",
    "group": "gof",
    "category": "gof/structural",
    "title": "Facade 是否应该管理子系统对象生命周期？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "外观是否拥有子系统取决于创建边界：应用级外观可管理一次性资源，注入已有服务的外观只协调调用并不负责销毁。把两种责任混在一起会造成双重释放或静态生命周期依赖，接口应该明确借用与拥有关系。",
    "pattern": "Facade",
    "source": "资料依据：GoF · GoF Facade subsystem interface"
  },
  {
    "id": "171",
    "group": "gof",
    "category": "gof/creation",
    "title": "Factory Method 如何把具体产品决定延迟到派生类？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "工厂方法在抽象产品接口中定义创建点，由具体创建者覆盖该方法来选择具体产品，业务流程仍写在基类中。它适合产品类型由子类或配置变化决定的框架，新增产品通常需要新增创建者而不是修改调用流程。",
    "pattern": "Factory Method",
    "source": "资料依据：GoF · GoF Factory Method product creation hook"
  },
  {
    "id": "172",
    "group": "gof",
    "category": "gof/creation",
    "title": "Factory Method 的扩展点应如何控制？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "扩展点应只暴露创建所需的最小产品接口，并让基类保证创建后不变量。把业务分支全部塞进工厂方法会退化为大型 switch。若产品族需要同时保持配套关系，应改用抽象工厂而不是无限增加创建者子类。",
    "pattern": "Factory Method",
    "source": "资料依据：GoF · GoF Factory Method product creation hook"
  },
  {
    "id": "173",
    "group": "gof",
    "category": "gof/structural",
    "title": "Flyweight 如何区分内在状态和外在状态？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "享元把可共享的内在状态放入池中，把位置、颜色等每次使用才确定的外在状态交给调用者。共享前必须证明内在状态不可变或有同步保护。否则节省内存会换来跨对象状态污染。如果只是简单转发，模式本身可能会让代码比问题更复杂。",
    "pattern": "Flyweight",
    "source": "资料依据：GoF · GoF Flyweight intrinsic and extrinsic state"
  },
  {
    "id": "174",
    "group": "gof",
    "category": "gof/structural",
    "title": "Flyweight 工厂怎样保证共享键和生命周期一致？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "享元工厂应以完整的内在状态作为规范化键，命中时返回同一个共享对象，并定义池的所有权和淘汰策略。弱引用或清晰的缓存生命周期可以避免池无限增长。键遗漏字段会让不同语义错误地共享状态。判断是否使用结构型模式时，要看对象之间的组合边界是否需要稳定下来，而不是只看类图是否复杂。",
    "pattern": "Flyweight",
    "source": "资料依据：GoF · GoF Flyweight intrinsic and extrinsic state"
  },
  {
    "id": "175",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Interpreter 如何用类层次表达小型语法规则？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "解释器模式把文法规则表示为表达式对象，每个非终结符组合子递归解释上下文，终结符读取输入或变量。它适合小而稳定的 DSL。文法规模或性能要求上升后，解析器生成器和专用 AST 通常更可维护。",
    "pattern": "Interpreter",
    "source": "资料依据：GoF · GoF Interpreter grammar representation"
  },
  {
    "id": "176",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Interpreter 上下文对象应保存哪些运行期信息？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "Context 保存解释过程中共享的输入游标、变量环境或诊断信息，表达式只通过约定接口读写这些状态。上下文若混入线程局部或全局数据会破坏可重入性，多个解释任务应该拥有独立上下文。这样解释器可以递归调用而不共享脏状态，也方便在出错时给出位置和变量信息。",
    "pattern": "Interpreter",
    "source": "资料依据：GoF · GoF Interpreter grammar representation"
  },
  {
    "id": "177",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Iterator 如何隐藏集合内部表示并提供统一访问协议？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "迭代器把遍历位置和递增规则封装起来，聚合对象只暴露 begin/end 或等价协议，客户端无需知道存储结构。不同迭代器可提供不同遍历策略。但是必须清楚比较、终止和失效规则，不能把抽象迭代器当成永不失效的指针。",
    "pattern": "Iterator",
    "source": "资料依据：GoF · GoF Iterator aggregate traversal"
  },
  {
    "id": "178",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "自定义 Iterator 的失效条件和所有权如何说明？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "自定义迭代器要声明其拥有的是容器的观察权而非元素所有权，并规定插入、删除、移动或容器销毁后的有效性。若迭代器跨线程或异步保存，容器和节点寿命必须由更高层契约保证，失效后继续递增或解引用属于未定义行为。",
    "pattern": "Iterator",
    "source": "资料依据：GoF · GoF Iterator aggregate traversal"
  },
  {
    "id": "179",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Mediator 如何把同事对象间的网状依赖集中起来？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "中介者让同事对象只依赖协调接口，由中介者编排交互而不是彼此直接调用，从而把网状依赖变成星形依赖。它适合协作规则集中且变化频繁的场景。但是中介者会承载过多业务时应该按用例拆分或引入领域服务。",
    "pattern": "Mediator",
    "source": "资料依据：GoF · GoF Mediator colleague collaboration"
  },
  {
    "id": "180",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Mediator 过度膨胀时怎样重划协作边界？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "当中介者同时知道所有同事的细节、状态和异常分支时，它已成为难以测试的上帝对象。可以按协作场景拆成多个中介者，或把稳定规则下沉回同事。拆分边界应由消息流和事务一致性决定。判断是否使用行为型模式时，要看变化的是算法、状态还是对象之间的通知关系。",
    "pattern": "Mediator",
    "source": "资料依据：GoF · GoF Mediator colleague collaboration"
  },
  {
    "id": "181",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Memento 如何在不暴露内部表示时保存状态？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "备忘录由发起者创建并保存内部状态快照，管理者只持有不透明句柄，从而恢复状态而不暴露表示细节。快照必须定义一致性时点和容量成本。包含外部资源句柄时不能假设恢复能重新建立资源。管理者不读取快照内容，只负责保存和交回快照，恢复逻辑仍由发起者自己完成。",
    "pattern": "Memento",
    "source": "资料依据：GoF · GoF Memento encapsulation boundary"
  },
  {
    "id": "182",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Memento 快照的所有权和版本号由谁维护？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "发起者应决定快照的格式与版本，管理者只负责保存、排序和淘汰，避免依赖私有字段。版本不兼容时应该拒绝恢复或执行明确迁移，快照的拥有者还要保证底层数据在恢复前一直有效。如果快照里含有外部资源或旧版本数据，恢复前要先判断这些依赖还是否可用。",
    "pattern": "Memento",
    "source": "资料依据：GoF · GoF Memento encapsulation boundary"
  },
  {
    "id": "183",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Observer 注册和取消订阅时如何避免悬空回调？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "观察者注册关系应有明确的取消机制，订阅令牌或弱引用可以避免被通知对象销毁后仍调用回调。通知线程与取消线程并发时需要同步快照和回调状态，不能只从容器里删除指针就宣称安全。判断是否使用行为型模式时，要看变化的是算法、状态还是对象之间的通知关系。",
    "pattern": "Observer",
    "source": "资料依据：GoF · GoF Observer subject notification"
  },
  {
    "id": "184",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Observer 通知期间修改订阅集合会发生什么？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "通知期间直接修改订阅容器可能使迭代器失效、跳过观察者或重复调用，常见做法是遍历快照并把增删操作延迟到通知结束。回调抛异常时还要决定继续通知还是终止，并避免让一个观察者破坏发布者的不变量。",
    "pattern": "Observer",
    "source": "资料依据：GoF · GoF Observer subject notification"
  },
  {
    "id": "185",
    "group": "gof",
    "category": "gof/creation",
    "title": "Prototype 复制对象时如何处理深拷贝和共享资源？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "原型的 clone 操作应该按对象语义决定深拷贝、共享不可变资源或复制所有权，不能由默认指针拷贝推断结果。多态复制通常要求虚拟 clone 返回拥有型指针，并为每个资源定义复制失败时的清理路径。",
    "pattern": "Prototype",
    "source": "资料依据：GoF · GoF Prototype cloning"
  },
  {
    "id": "186",
    "group": "gof",
    "category": "gof/creation",
    "title": "原型注册表如何管理复制入口？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "原型注册表把类型键映射到可复制的原型对象，客户端按键请求 clone 而不依赖具体类名。注册表需规定替换、并发读写和对象所有权，未知键应返回可诊断错误而不是空指针继续执行。判断是否使用创建型模式时，要看对象创建的变化点是否真的需要隔离，而不是只为了增加一层工厂。",
    "pattern": "Prototype",
    "source": "资料依据：GoF · GoF Prototype cloning"
  },
  {
    "id": "187",
    "group": "gof",
    "category": "gof/structural",
    "title": "Proxy 如何在不改变真实对象接口的情况下增加访问控制？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "代理实现与真实主题相同的接口，可以在转发前后加入权限、缓存、远程传输或日志。因此客户端无需改写调用协议。代理不应该伪装成同步本地对象来掩盖网络延迟和失败，远程代理尤其要明确超时、重试和资源所有权。",
    "pattern": "Proxy",
    "source": "资料依据：GoF · GoF Proxy subject access control"
  },
  {
    "id": "188",
    "group": "gof",
    "category": "gof/structural",
    "title": "虚拟 Proxy 延迟创建资源时如何报告失败？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "虚拟代理首次收到需要真实主题的请求时才创建它，创建失败应该通过与主题一致的错误通道返回，并保持代理可再次尝试或进入终止状态。延迟初始化减小首屏成本，却把故障推迟到业务调用，调用方必须能区分未加载与已加载失败。",
    "pattern": "Proxy",
    "source": "资料依据：GoF · GoF Proxy subject access control"
  },
  {
    "id": "189",
    "group": "gof",
    "category": "gof/creation",
    "title": "Singleton 的唯一实例如何保证线程安全初始化？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "C++11 的函数内静态对象在首次控制流经过声明时初始化，并由语言保证并发初始化只发生一次。这通常比手写双重检查更可靠。Singleton 仍引入全局可变状态和隐藏依赖，测试替换与析构顺序是采用前必须接受的代价。",
    "pattern": "Singleton",
    "source": "资料依据：GoF · GoF Singleton sole instance and global access"
  },
  {
    "id": "190",
    "group": "gof",
    "category": "gof/creation",
    "title": "Singleton 生命周期与静态析构顺序有何风险？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "函数内静态 Singleton 的销毁顺序与其他静态对象的跨翻译单元顺序可能不匹配，析构阶段访问已销毁依赖会产生未定义行为。可以通过显式生命周期管理、泄漏到进程结束或把依赖注入使用方规避。但是每种选择都改变资源回收和测试策略。",
    "pattern": "Singleton",
    "source": "资料依据：GoF · GoF Singleton sole instance and global access"
  },
  {
    "id": "191",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "State 如何把状态行为从大型条件分支中拆出？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "状态模式把每个状态相关行为放入独立对象，由上下文委托当前状态处理事件并在需要时切换。状态数量或转移规则增长时它能替代巨型条件分支。但是对象切换、共享数据和转移合法性需要额外契约。如果状态很少且转移稳定，简单条件分支反而更直接，不必为了模式拆出一堆类。",
    "pattern": "State",
    "source": "资料依据：GoF · GoF State state-dependent behavior"
  },
  {
    "id": "192",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "共享 State 对象时如何隔离瞬时数据？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "可共享的无状态 State 可以放入注册表。但是用户输入、超时等瞬时数据必须保存在上下文或事件对象中，不能写进共享状态实例。若状态含可变字段，就应该按上下文隔离或加同步。否则一个会话的转移会污染另一个会话。",
    "pattern": "State",
    "source": "资料依据：GoF · GoF State state-dependent behavior"
  },
  {
    "id": "193",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Strategy 如何把可替换行为封装成稳定接口？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "策略模式把一组可互换算法封装成共同接口，由上下文持有并委托当前策略，从而把选择与算法实现分离。它适合运行时或配置驱动的算法变化。但是策略类过多会增加装配和间接调用成本，固定且简单的分支可能更清楚。",
    "pattern": "Strategy",
    "source": "资料依据：GoF · GoF Strategy interchangeable algorithm"
  },
  {
    "id": "194",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "运行时选择 Strategy 时依赖和生命周期如何管理？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "运行时策略可以由依赖注入提供，拥有关系应由上下文、调用者或共享指针中的一个边界明确承担。切换策略时要处理正在执行的调用、线程安全和旧策略释放，不能只替换裸指针。如果策略很轻量且无状态，可以按值保存；如果策略持有资源，切换时要先约定谁负责释放。",
    "pattern": "Strategy",
    "source": "资料依据：GoF · GoF Strategy interchangeable algorithm"
  },
  {
    "id": "195",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Template Method 如何固定流程骨架并开放可变步骤？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "模板方法在基类中固定算法骨架，通过受保护的原语操作或钩子把可变步骤交给子类。调用者只看到稳定的公共流程。它利用继承实现编译期复用，代价是基类控制反转且子类组合受限，需要防止钩子破坏骨架不变量。",
    "pattern": "Template Method",
    "source": "资料依据：GoF · GoF Template Method algorithm skeleton and hooks"
  },
  {
    "id": "196",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Template Method 钩子函数如何处理异常和默认行为？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "钩子通常提供无操作或保守默认实现，子类只覆盖确有需要的步骤。异常是否向上冒泡由模板方法的事务契约决定。模板方法若在中途吞掉异常或继续使用半完成状态，会让子类无法判断提交边界，应该保持失败后的对象不变量。",
    "pattern": "Template Method",
    "source": "资料依据：GoF · GoF Template Method algorithm skeleton and hooks"
  },
  {
    "id": "197",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "Visitor 如何在不修改元素层次时增加新操作？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "访问者把操作放进独立对象，元素通过 accept 将自身类型分派给对应 visit，从而新增操作无需修改元素类。它适合元素层次稳定而操作经常增加的系统。新增元素则要求修改所有访问者，类型安全与扩展方向存在明确取舍。",
    "pattern": "Visitor",
    "source": "资料依据：GoF · GoF Visitor double dispatch and operation extension"
  },
  {
    "id": "198",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "双重分派在 Visitor 中解决了什么类型限制？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "第一次分派选择元素的动态类型，accept 内部的第二次分派选择具体访问者重载，这正是双重分派绕过单次虚调用类型限制的机制。实现需要为每种元素维护 visit 重载，接口变更会带来较大的编译影响，且跨模块 ABI 要保持一致。",
    "pattern": "Visitor",
    "source": "资料依据：GoF · GoF Visitor double dispatch and operation extension"
  },
  {
    "id": "199",
    "group": "gof",
    "category": "gof/creation",
    "title": "Abstract Factory 与依赖注入如何保持接口稳定？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "依赖注入把抽象工厂作为构造或启动边界的依赖，业务对象只调用抽象产品接口，不直接实例化具体工厂。这样测试可以注入替身并整体切换产品族。但是工厂接口仍会随新增产品扩张，不能把依赖注入误当成消除产品族约束。",
    "pattern": "Abstract Factory",
    "source": "资料依据：GoF · GoF Abstract Factory intent and product-family consistency"
  },
  {
    "id": "200",
    "group": "gof",
    "category": "gof/creation",
    "title": "Builder 与命名构造函数如何取舍？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "命名构造函数适合少量互斥选项，能保持调用点短且直接返回完整对象。Builder 更适合许多可选步骤、校验或多种表示。Builder 会增加类型和状态管理，若没有复杂构造过程，采用它反而扩大 API 和维护成本。",
    "pattern": "Builder",
    "source": "资料依据：GoF · GoF Builder construction process and representation"
  },
  {
    "id": "201",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UObject 反射元数据由谁生成，运行时如何查询并避免依赖生成细节？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "UHT 在构建阶段读取反射宏并生成注册代码，运行时由 UClass、FProperty 和 UFunction 等对象保存反射信息。查询应该使用 StaticClass、GetClass、FindFunction 或字段迭代 API，不应该直接依赖 Intermediate 下的生成符号和文件布局。",
    "source": "资料依据：Epic Games · Unreal Header Tool and UObject Reflection System"
  },
  {
    "id": "202",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UCLASS 与 USTRUCT 在 UHT 处理、默认构造和序列化能力上有哪些边界？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "UCLASS 类型由 UHT 注册且实例必须通过 UObject 创建路径产生，具备对象身份、反射引用和 GC 生命周期。USTRUCT 是可按值构造、复制和嵌套的数据类型，只有被反射标记的字段才自动参与属性序列化和编辑器工具。",
    "source": "资料依据：Epic Games · UObjects, UStructs, and Reflection"
  },
  {
    "id": "203",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "哪些 UFUNCTION 和 UPROPERTY specifier 会改变 Blueprint 暴露、网络复制或编辑器可见性？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "BlueprintCallable、BlueprintPure、BlueprintNativeEvent 等 UFUNCTION specifier 决定蓝图调用或覆盖方式，EditAnywhere、BlueprintReadWrite、ReplicatedUsing 等 UPROPERTY specifier 分别控制编辑、脚本访问和复制。它们属于独立维度，能在蓝图中看到属性并不代表该属性会保存或同步到网络。",
    "source": "资料依据：Epic Games · UFunctions and Unreal Property System Specifiers"
  },
  {
    "id": "204",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "哪些 C++ 声明或 include 写法会让 UHT 解析失败，如何定位生成错误？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "UHT 只解析受支持的反射声明，缺少或未放在最后的 generated.h、宏括号错误、把反射宏藏进复杂宏以及不受支持的模板签名都可能中断生成。定位时应该读取构建日志中最早的 UHT 错误和对应源文件行，生成目录只用于核对，不能手工修补。",
    "source": "资料依据：Epic Games · Unreal Header Tool Parsing and Generated Headers"
  },
  {
    "id": "205",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "GENERATED_BODY 的插入位置和声明顺序有什么要求，常见编译错误如何判断？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "GENERATED_BODY 必须位于对应 UCLASS、USTRUCT 或 UINTERFACE 声明体内且只出现一次，并与该头文件最后包含的 generated.h 配对。它展开的声明与文件和行号关联，移动代码后的异常应该通过重新运行 UHT 或清理陈旧 Intermediate 产物解决。",
    "source": "资料依据：Epic Games · GENERATED_BODY and Generated Code"
  },
  {
    "id": "206",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "EditAnywhere、VisibleInstanceOnly 等 specifier 如何决定属性编辑器中的修改权限？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "EditAnywhere 同时允许修改类默认值和实例，EditDefaultsOnly 与 EditInstanceOnly 分别限制到默认对象或关卡实例，Visible 系列只改变详情面板的可编辑性。BlueprintReadOnly、Config、SaveGame 和 Replicated 等规则另行决定脚本访问、配置保存或网络同步，不能由 Edit/Visible specifier 推导。",
    "source": "资料依据：Epic Games · Property Specifiers and Editor Visibility"
  },
  {
    "id": "207",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "Outer 如何参与对象归属、命名和 GC 可达性，什么时候不应随意复用？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "Outer 决定 UObject 的包含关系、完整对象路径和包归属，并影响查找、复制与保存上下文。Outer 不是通用的强 GC 所有权，生命周期较长的对象仍然需要通过反射引用、FGCObject 或根集合保持可达，不能只借用一个看似稳定的 Outer。",
    "source": "资料依据：Epic Games · UObject Outer and Object Ownership Hierarchy"
  },
  {
    "id": "208",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "NewObject 的 Outer、模板对象和对象标志参数如何影响初始化与 GC？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "NewObject 使用 Outer 和可选 Name 建立归属与身份，可以从 Template 复制初始属性，并用 EObjectFlags 控制瞬态、公开或事务等对象特征。对象创建完成后是否存活仍由 GC 引用图决定，Outer 和 RF_Transient 都不会自动把它变成根对象。",
    "source": "资料依据：Epic Games · UObject Instance Creation with NewObject"
  },
  {
    "id": "209",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "RF_Transient、RF_Public 等对象标志分别影响哪些保存、复制和 GC 行为？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "RF_Transient 阻止对象进入常规包保存，RF_Public 允许对象作为包的公开导出被外部引用，其他标志还描述默认对象、原型和销毁阶段。大多数标志不是 GC 强引用，判断存活性仍要看可达关系并使用 IsValid 等生命周期 API。",
    "source": "资料依据：Epic Games · EObjectFlags and UObject Lifecycle"
  },
  {
    "id": "210",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "GC root、UPROPERTY 引用和容器引用如何共同决定 UObject 是否可达？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "根集合中的对象以及从根对象沿 UPROPERTY、TObjectPtr、反射容器或 AddReferencedObjects 能遍历到的 UObject 都保持可达。未反射的裸指针和普通 C++ 容器不会自动进入 GC 引用图。因此必须改用受跟踪引用或显式引用收集。",
    "source": "资料依据：Epic Games · Garbage Collection and Reflected Object References"
  },
  {
    "id": "211",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "TObjectPtr 与裸 UObject 指针在 GC、编辑器和序列化场景下有什么差异？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "TObjectPtr 是 UE5 推荐的 UObject 成员指针表示，配合 UPROPERTY 时可参与 GC、序列化以及编辑器中的引用跟踪和重定向。裸 UObject 指针若同样标记为 UPROPERTY 仍可以被反射系统跟踪。但是未反射的裸指针和未反射的 TObjectPtr 都不能单独充当 GC 根。",
    "source": "资料依据：Epic Games · Object Pointers and TObjectPtr"
  },
  {
    "id": "212",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "TWeakObjectPtr 如何表达弱引用，IsValid 与 Pin 的使用边界是什么？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "TWeakObjectPtr 通过对象索引和序列号观察 UObject，不增加强引用。对象被销毁后 IsValid 为假且 Get 返回空。Pin 是 TWeakPtr 的接口而不是 TWeakObjectPtr 的接口，使用 UObject 弱指针时应该在游戏线程取得 Get 结果并立即重新校验。",
    "source": "资料依据：Epic Games · Weak Object Pointers and TWeakObjectPtr"
  },
  {
    "id": "213",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UObject 反射信息如何影响序列化、编辑器工具和运行时类型判断？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "反射数据让引擎按 FProperty 枚举字段、序列化资产、生成详情面板、调用蓝图函数，并通过 Cast 或 IsA 判断运行时类型。普通 C++ 成员和函数若没有反射声明就不会自动进入这些管线，需要自定义序列化或工具代码。",
    "source": "资料依据：Epic Games · UObject Reflection Runtime Services"
  },
  {
    "id": "214",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "选择 UCLASS 还是 USTRUCT 时，如何权衡 GC、复制和按值传递？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "UCLASS 适合具有身份、继承、多态和 GC 引用关系的长寿命对象，通常通过指针传递而不按值复制。USTRUCT 适合小型数据和值语义传递，可以被反射和序列化但不会作为独立 GC 对象。其中的 UObject 引用仍然需要用 UPROPERTY 等方式暴露给引用收集器。",
    "source": "资料依据：Epic Games · Choosing UObjects versus UStructs"
  },
  {
    "id": "215",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UFUNCTION 或 UPROPERTY 声明变化后，UHT 生成代码和二进制接口会受到什么影响？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "修改 UFUNCTION 或 UPROPERTY 的签名、类型或 specifier 会改变 UHT 生成的注册表、调用桩和属性布局，依赖模块及相关蓝图资产通常需要重新编译。跨模块公开声明还受模块 API 宏和 C++ ABI 影响，布局级变化不应该只依赖热重载来验证。",
    "source": "资料依据：Epic Games · UHT Generated Code for UFunctions and Properties"
  },
  {
    "id": "216",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UHT 的解析边界如何影响模板、宏和跨模块反射声明？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "UHT 不是完整 C++ 编译器，只支持反射系统认可的模板形状、参数类型和宏位置，模板 UCLASS 或隐藏在任意宏中的反射声明通常无法注册。跨模块使用反射类型还需要要正确的 Build.cs 依赖、可见头文件和 API 导出。否则生成代码会在编译或链接阶段缺少注册符号。",
    "source": "资料依据：Epic Games · Unreal Header Tool Limitations and Module Visibility"
  },
  {
    "id": "217",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "迁移或重命名反射类型时，GENERATED_BODY 与生成文件如何保持一致？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "反射类型的源头始终是头文件声明，GENERATED_BODY 和 generated.h 应由 UHT 重新生成而不是随类型手工搬运。重命名已被资产引用的类、结构体或属性时还要配置 Core Redirects，并让依赖蓝图重新加载和编译。",
    "source": "资料依据：Epic Games · Core Redirects and Generated Reflection Code"
  },
  {
    "id": "218",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "属性的编辑器权限与运行时可写性、配置保存和复制是否是同一概念？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "Edit 和 Visible specifier 只控制详情面板在哪类对象上允许修改，C++ 运行时仍可按访问权限写入成员。Config、SaveGame、Transient、Replicated 和 BlueprintReadWrite 分别属于配置、存档、持久化排除、网络和蓝图访问规则，彼此不会自动联动。",
    "source": "资料依据：Epic Games · Property Specifier Semantics"
  },
  {
    "id": "219",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "跨关卡或异步加载时，Outer 选择错误会造成哪些生命周期问题？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "错误的 Outer 会把对象放入不合适的 World、Package 或临时对象层级，导致对象路径、保存归属和关卡卸载时机与预期不一致。跨关卡或异步工作应选择与真实寿命匹配的 Outer，保留明确强引用，并在 World 清理时取消回调。",
    "source": "资料依据：Epic Games · UObject Outer across Worlds and Async Loading"
  },
  {
    "id": "220",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "运行时创建 UObject 时，何时应使用 NewObject、DuplicateObject 或 CreateDefaultSubobject？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "NewObject 用于运行时创建全新 UObject，DuplicateObject 复制已有对象及其可复制属性，CreateDefaultSubobject 只应该在拥有类构造期间建立默认子对象模板。动态 ActorComponent 通常用 NewObject 创建，再按需要加入实例组件列表、附加并注册。",
    "source": "资料依据：Epic Games · Creating and Duplicating UObject Instances"
  },
  {
    "id": "221",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "调试 UObject 生命周期时，如何利用对象标志判断对象所处阶段？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "RF_ClassDefaultObject、RF_ArchetypeObject、RF_Transient、RF_BeginDestroyed 和 RF_FinishDestroyed 等标志可辅助判断对象角色与销毁阶段。单个标志不能证明对象安全可用，调试时还要结合 IsValid、GC 引用链、BeginDestroy/FinishDestroy 日志和创建调用栈。",
    "source": "资料依据：Epic Games · EObjectFlags for UObject Lifecycle Diagnostics"
  },
  {
    "id": "222",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "异步任务或非 UPROPERTY 指针持有 UObject 时，怎样避免被 GC 提前回收？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "后台任务不应该靠裸指针延长 UObject 寿命，可以由游戏线程上的 UPROPERTY、TStrongObjectPtr、FGCObject 或受控 Root 引用明确保持对象，且 Root 必须成对移除。更常见的做法是捕获 TWeakObjectPtr，只在切回游戏线程后重新校验对象和 World，再应用纯数据结果。",
    "source": "资料依据：Epic Games · Garbage Collection with Async Tasks"
  },
  {
    "id": "223",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "Actor 的构造函数、OnConstruction、BeginPlay 分别何时调用，哪些对象此时可用？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "C++ 构造函数会为 CDO 和实例执行，只适合设置默认值和创建默认子对象，不能假定已有有效 World。OnConstruction 在属性初始化后构建实例并可能在编辑器反复执行，BeginPlay 则在组件注册完成且世界进入游戏后用于一次性的运行时逻辑。",
    "source": "资料依据：Epic Games · Actor Lifecycle: Construction and BeginPlay"
  },
  {
    "id": "224",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "编辑器修改属性时 OnConstruction 为什么会重复执行，如何避免副作用？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "编辑器修改属性、移动 Actor 或重新运行 Construction Script 都可能再次调用 OnConstruction。因此函数必须从当前属性确定性地产生结果。不可逆的存档、网络请求、外部文件写入和一次性玩法事件应该放到 BeginPlay 或显式命令，而不是构造阶段。",
    "source": "资料依据：Epic Games · OnConstruction and Construction Script Reruns"
  },
  {
    "id": "225",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "BeginPlay 与组件注册、网络初始化的先后关系如何确认？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "BeginPlay 发生在 Actor 组件完成注册和初始化之后，组件才具备正常的 World 与 Tick 上下文。复制 Actor 的初始属性通常随初始网络数据到达。但是所有权、Pawn 绑定或后续复制仍可能晚到，依赖它们的代码应该使用相应回调并通过日志验证时序。",
    "source": "资料依据：Epic Games · Actor Lifecycle and BeginPlay Networking"
  },
  {
    "id": "226",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "SpawnCollisionHandlingOverride、Owner、Instigator 等参数如何影响 Actor 生成结果？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "SpawnCollisionHandlingOverride 可以让生成因碰撞失败、调整位置或强制生成。因此必须检查 SpawnActor 的返回值和最终变换。Owner 影响网络所有权、相关性和 RPC 路由，Instigator 用于伤害或行为归因。它们都不会自动建立组件附加关系。",
    "source": "资料依据：Epic Games · Spawning Actors and FActorSpawnParameters"
  },
  {
    "id": "227",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "运行时组件从创建到附加、RegisterComponent 和激活需要遵循什么顺序？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "运行时组件通常以 Actor 为 Outer 创建，需要保存为实例组件时调用 AddInstanceComponent，并在附加关系确定后注册到正确 World。未注册的组件没有渲染、物理或 Tick 状态，注册后再用 Activate 或 SetComponentTickEnabled 控制运行。",
    "source": "资料依据：Epic Games · Creating and Registering Actor Components"
  },
  {
    "id": "228",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "设置 RootComponent、父子附加和相对变换时，如何避免层级与变换错乱？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "RootComponent 必须是该 Actor 拥有的 USceneComponent，子组件应该通过 SetupAttachment 或 AttachToComponent 建立层级，而不是直接写 AttachParent。附加时要明确 KeepRelative、KeepWorld 或 SnapToTarget 变换规则，并在运行时动态层级中按根到叶的顺序注册。",
    "source": "资料依据：Epic Games · Scene Component Attachment and Root Components"
  },
  {
    "id": "229",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "CreateDefaultSubobject 创建的默认子对象与运行时组件有什么区别？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "CreateDefaultSubobject 在构造函数中建立 CDO 的默认子对象模板，实例会继承这些组件并在编辑器中获得稳定的默认结构。运行时通过 NewObject 创建的组件只属于当前实例，若未加入实例组件列表并注册，就不会自动获得同样的编辑器显示、复制和保存行为。",
    "source": "资料依据：Epic Games · Default Subobjects and Instanced Components"
  },
  {
    "id": "230",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "动态组件创建后何时注册、设置所有者并加入实例组件列表？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "动态组件应以目标 Actor 为 Outer 创建，按需求调用 AddInstanceComponent 标记实例归属，设置附加关系后调用 RegisterComponent。注册会把组件加入 World 的运行系统，激活和 Tick 开关应该在所有依赖和初始属性就绪后设置。",
    "source": "资料依据：Epic Games · Runtime Component Creation"
  },
  {
    "id": "231",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "TickFunction 的前置依赖如何声明，怎样保证组件更新顺序稳定？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "组件可用 AddTickPrerequisiteComponent 或 AddTickPrerequisiteActor 建立细粒度前置关系，TickGroup 只提供更粗的阶段顺序。依赖图应无环且两端 TickFunction 都已注册和启用，不能依赖组件数组或注册偶然顺序。",
    "source": "资料依据：Epic Games · Actor Ticking and Tick Prerequisites"
  },
  {
    "id": "232",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "PrimaryComponentTick 如何控制 Tick、TickGroup 和运行时开关？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "构造阶段通过 PrimaryComponentTick.bCanEverTick、bStartWithTickEnabled、TickGroup 和 TickInterval 定义组件的 Tick 能力与默认调度。运行时使用 SetComponentTickEnabled 或 SetTickInterval 控制已注册 Tick，关闭 bCanEverTick 的组件不能只靠运行时开关获得 Tick。",
    "source": "资料依据：Epic Games · Component Tick Configuration"
  },
  {
    "id": "233",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "WorldSubsystem 的实例范围和初始化时机如何与 UWorld 生命周期对应？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "UWorldSubsystem 会为每个符合条件的 UWorld 创建独立实例，并在对应 World 的 Initialize/Deinitialize 区间内有效。它适合世界级缓存和服务，不适合保存无缝跨关卡或跨多个 World 的全局会话状态。",
    "source": "资料依据：Epic Games · Programming Subsystems: UWorldSubsystem"
  },
  {
    "id": "234",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "GameInstanceSubsystem 适合持有哪些跨关卡状态，何时销毁？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "UGameInstanceSubsystem 与 GameInstance 同寿命，通常跨普通关卡切换存在，适合账户、会话或不依附具体 World 的服务状态。它不应该长期强引用旧 World 的 Actor 和组件，世界切换时应该通过委托更新或清理这些引用。",
    "source": "资料依据：Epic Games · Programming Subsystems: UGameInstanceSubsystem"
  },
  {
    "id": "235",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "Subsystem 的 Initialize、Deinitialize 与依赖模块加载顺序如何协调？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "Subsystem 的 Initialize 和 Deinitialize 是注册委托、创建服务及对称清理的边界，需要其他 Subsystem 时可以通过 FSubsystemCollectionBase::InitializeDependency 声明顺序。所需模块仍然应该由目标和 Build.cs 保证已加载，关闭阶段要取消异步任务并解除跨模块回调。",
    "source": "资料依据：Epic Games · Subsystem Initialization and Dependencies"
  },
  {
    "id": "236",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "ChildActorComponent 的子 Actor 创建、重建和销毁时机有哪些陷阱？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "ChildActorComponent 在注册或类配置变化时创建子 Actor，并可能在编辑器重建 Construction Script 时销毁旧实例。外部代码不能永久缓存 ChildActor 裸指针，应该在重建后重新获取并让组件负责创建和销毁流程。",
    "source": "资料依据：Epic Games · Child Actor Component Lifecycle"
  },
  {
    "id": "237",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "组件模板与实例属性如何区分，编辑器默认值何时复制到实例？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "组件模板存在于 CDO 或蓝图生成类中，实例构造或复制时从模板取得默认属性，实例覆盖随后独立保存。修改模板通常影响新实例和未覆盖的默认值，不能假定会重写关卡中已有实例的显式覆盖。落到工程里，要把创建时机、注册状态和销毁顺序一起看，避免只盯着某一个回调。",
    "source": "资料依据：Epic Games · Component Templates and Class Default Objects"
  },
  {
    "id": "238",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "EndPlay、OnDestroyed 和 Actor 析构函数各自负责什么，如何安排清理顺序？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "EndPlay 覆盖销毁、关卡切换、停止 PIE 等多种离场原因，适合停止 Timer、异步任务和委托。OnDestroyed 更偏向 Actor 被 Destroy 的通知。C++ 析构发生得更晚且此时 World 与 UObject 协作者可能已不可用，不应该承担主要玩法清理。",
    "source": "资料依据：Epic Games · Actor Lifecycle: EndPlay and Destroyed"
  },
  {
    "id": "239",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "Actor 构造函数中创建默认子对象时，为什么不能依赖 World 或运行时状态？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "Actor 构造函数也会为 CDO、加载和复制路径执行，此时实例可能尚未关联 World，GameMode、PlayerController 和运行时子系统都不可靠。构造阶段只定义默认属性和默认子对象，依赖 World 的初始化应移到 PostInitializeComponents、BeginPlay 或更具体的生命周期回调。",
    "source": "资料依据：Epic Games · Actor Constructors and Class Default Objects"
  },
  {
    "id": "240",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "OnConstruction 在运行时 SpawnActor 与编辑器放置 Actor 时有何不同？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "编辑器放置 Actor 的 OnConstruction 会随属性编辑和重建多次运行，并携带关卡实例的覆盖值。SpawnActor 路径则在生成流程中使用 Spawn 参数和 ExposeOnSpawn 值，延迟生成还要等 FinishSpawning 才执行完整构造。因此逻辑必须可重复且不依赖固定调用次数。",
    "source": "资料依据：Epic Games · Construction Script for Placed and Spawned Actors"
  },
  {
    "id": "241",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "单播 Delegate 的绑定对象、执行结果和解绑时机如何定义？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "单播 Delegate 只保存一个可以调用目标，执行有返回值的委托前应该检查 IsBound，再用 Execute 获取结果。绑定者和发布者必须约定谁持有 FDelegateHandle 或何时 Unbind，避免长寿命发布者继续引用已结束的非 UObject 目标。",
    "source": "资料依据：Epic Games · Delegates: Single-Cast Delegates"
  },
  {
    "id": "242",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "多播 Delegate 的调用顺序和广播期间订阅变更如何处理？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "多播 Delegate 向多个绑定广播且不提供聚合返回值，Epic 的委托契约不保证可依赖的调用顺序。广播期间增删绑定会让行为难以推理，通常应该保存 FDelegateHandle 并把变更延迟到本轮 Broadcast 结束。",
    "source": "资料依据：Epic Games · Delegates: Multicast Delegates"
  },
  {
    "id": "243",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "动态 Delegate 在反射、序列化和性能开销之间有什么取舍？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "动态 Delegate 通过反射和 UFUNCTION 名称绑定，可以被蓝图使用并支持序列化。但是签名类型受反射系统限制且调用成本高于原生 Delegate。纯 C++ 高频回调和 Lambda 更适合原生委托，需要资产保存或蓝图绑定时再选择动态委托。",
    "source": "资料依据：Epic Games · Delegates: Dynamic Delegates"
  },
  {
    "id": "244",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "AddUObject、AddRaw 和 AddLambda 的生命周期风险分别是什么？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "AddUObject 记录 UObject 弱绑定并在对象失效后跳过调用，AddRaw 不跟踪普通 C++ 对象寿命，目标析构前必须显式移除。AddLambda 的捕获寿命完全由调用方管理，涉及 UObject 时可用 AddWeakLambda 或捕获弱对象后再校验。",
    "source": "资料依据：Epic Games · Delegate Binding and UObject Lifetime"
  },
  {
    "id": "245",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "对象销毁、EndPlay 或移动后，怎样可靠地清理 Delegate 绑定？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "绑定长寿命发布者时应该保存 FDelegateHandle，并在 EndPlay、Deinitialize 或普通 C++ 对象析构前调用 Remove、RemoveAll 或 Unbind。AddUObject 能阻止无效 UObject 被执行。但是仍然应该清理无用条目。Raw 和 Lambda 绑定更不能依赖发布者猜测目标寿命。",
    "source": "资料依据：Epic Games · Removing Delegate Bindings"
  },
  {
    "id": "246",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "BlueprintNativeEvent 的 C++ 基类实现、_Implementation 和覆盖规则如何配合？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "BlueprintNativeEvent 会生成可以从蓝图覆盖的入口，C++ 默认行为写在 FunctionName_Implementation 中，业务代码应该调用 FunctionName 以经过蓝图分派。派生 C++ 类覆盖 _Implementation，直接调用 _Implementation 会绕过蓝图覆盖和生成的事件入口。",
    "source": "资料依据：Epic Games · UFunctions: BlueprintNativeEvent"
  },
  {
    "id": "247",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "UINTERFACE 与纯 C++ 接口的反射声明、实现类和调用方式有什么区别？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "UINTERFACE 声明反射可见的 U 类，配套的 I 接口承载 C++ 函数契约，实现 UObject 类同时继承 I 接口并在 UCLASS 中声明 ImplementsInterface。纯 C++ 接口可直接虚调用。但是要支持蓝图实现时应该使用反射检查和生成的 Execute_ 函数。",
    "source": "资料依据：Epic Games · Unreal Interfaces"
  },
  {
    "id": "248",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "如何在 UObject、UInterface 和实现类指针之间安全转换并检查有效性？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "应先用 IsValid 检查 UObject，再用 GetClass()->ImplementsInterface 判断反射接口，并通过 IMyInterface::Execute_Function 调用以兼容蓝图实现。直接 static_cast 或只依赖 Cast<IMyInterface> 可能遗漏蓝图专有实现，TScriptInterface 也要同时保持对象和接口语义正确。",
    "source": "资料依据：Epic Games · Calling Unreal Interfaces"
  },
  {
    "id": "249",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "AsyncTask 切换线程时如何保证 UObject 访问发生在正确线程？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "后台线程只处理复制出的普通数据，任何 UObject、World、Actor 或组件访问都应该通过 AsyncTask 切回 ENamedThreads::GameThread。回调捕获 TWeakObjectPtr 和任务代次，回到游戏线程后重新检查对象、World 和取消状态再写入结果。",
    "source": "资料依据：Epic Games · AsyncTask and Game Thread UObject Access"
  },
  {
    "id": "250",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "线程池任务怎样管理捕获对象、取消和完成回调以避免竞态？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "线程池任务应该按值捕获不可变输入或受同步保护的共享状态，取消通过原子标志等协作机制完成而不是强杀线程。完成回调用一次性状态门控后投递游戏线程，关闭时等待或失效任务，避免回调与资源销毁并发。",
    "source": "资料依据：Epic Games · Async Work and Thread Pool Tasks"
  },
  {
    "id": "251",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "TFuture 与 TPromise 的结果传递、等待和错误状态如何设计？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "TPromise 由生产者设置结果，关联 TFuture 由消费者 Wait、IsReady 或 Get，等待游戏线程会阻塞帧并可能形成死锁。Unreal 常见构建关闭 C++ 异常，失败应放入显式结果类型或状态码，而不是假设 Future 会传递异常对象。",
    "source": "资料依据：Epic Games · TFuture and TPromise"
  },
  {
    "id": "252",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "Latent Action 的生命周期、World Context 和取消条件如何管理？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "Latent Action 由对应 UWorld 的 FLatentActionManager 按 CallbackTarget 和 UUID 跟踪，WorldContextObject 错误会把任务放入错误世界或无法恢复蓝图执行。动作更新时应该检查目标、取消条件和世界清理状态，并保证完成分支只触发一次。",
    "source": "资料依据：Epic Games · Latent Actions and FLatentActionManager"
  },
  {
    "id": "253",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "异步加载完成回调如何持有资源引用并处理加载失败或对象销毁？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "异步资源加载应该保留 FStreamableHandle 或由 Asset Manager 管理活动句柄，软路径只描述资源而不保证已经驻留。完成回调在使用资产前检查加载结果和弱目标，失败、取消或 World 销毁时释放句柄并返回可诊断状态。",
    "source": "资料依据：Epic Games · Asynchronous Asset Loading"
  },
  {
    "id": "254",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "取消异步任务时，如何处理已排队回调、线程安全和资源释放？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "取消通常只是设置协作标志或撤销尚未开始的工作，已经排队的游戏线程回调仍可能到达。任务状态应该通过原子或锁从 Pending 只转移到 Completed/Cancelled 一次，回调再次检查状态并在正确线程释放 UObject 相关资源。",
    "source": "资料依据：Epic Games · Cancelling Async Tasks"
  },
  {
    "id": "255",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "bReplicates、NetLoadOnClient 等网络标志如何决定 Actor 是否复制？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "bReplicates 允许服务器 Actor 建立网络通道，实际发送还受服务器生成、连接相关性、休眠和更新策略影响。NetLoadOnClient 控制关卡放置 Actor 是否由客户端加载，Owner、bAlwaysRelevant 等标志改变相关性或 RPC 路由，客户端自行生成的 Actor 不会因此成为权威复制对象。",
    "source": "资料依据：Epic Games · Actor Replication Settings"
  },
  {
    "id": "256",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "ReplicatedUsing 的 OnRep 回调何时触发，初始同步和服务器修改有何差异？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "ReplicatedUsing 属性在客户端收到网络更新时调用 OnRep，初始同步和重新进入相关范围也可能触发。服务器直接赋值不会自动调用同名回调。共享副作用可抽成幂等函数，由服务器写入后显式调用，客户端则从 OnRep 调用，避免把每次本地赋值当成复制事件。",
    "source": "资料依据：Epic Games · Replicate Actor Properties with RepNotify"
  },
  {
    "id": "257",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "DOREPLIFETIME 与条件复制如何声明属性，成员变化怎样进入复制布局？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "复制属性必须在 GetLifetimeReplicatedProps 中用 DOREPLIFETIME 或条件宏注册，服务器对成员的变化随后由复制系统按连接发送。复制布局按类建立，不能根据某个实例的临时状态跳过注册。运行时差异应该使用条件、Active Override 或 Push Model 的脏标记机制。",
    "source": "资料依据：Epic Games · Replicate Actor Properties"
  },
  {
    "id": "258",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "COND_OwnerOnly、COND_SkipOwner 等条件如何与连接所有权共同生效？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "COND_OwnerOnly 只向 Actor 的拥有连接发送，COND_SkipOwner 排除该连接，条件结果依赖服务器上的 NetOwner 链而不只是一个 Owner 指针名字。所有权尚未建立或刚切换时目标连接可能不同，RPC 和复制条件应该在确认拥有关系后使用。",
    "source": "资料依据：Epic Games · Conditional Property Replication"
  },
  {
    "id": "259",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "服务器权威模型下，客户端输入、验证和状态回写的边界如何划分？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "客户端通过自己拥有的 Actor 发送输入或意图，服务器校验身份、速率、资源和当前状态后才修改权威属性。客户端预测只改善响应，最终状态由服务器复制回来并触发校正，不能信任客户端直接提交的位置、伤害或库存结果。",
    "source": "资料依据：Epic Games · Server Authority in Network Multiplayer"
  },
  {
    "id": "260",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "NetMulticast RPC 的调用前提、可靠性和非相关客户端行为如何判断？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "NetMulticast RPC 只有从服务器调用时才会在服务器和当前相关客户端执行，从客户端调用只产生本地行为。Unreliable 调用可能丢失，Reliable 也不会为晚加入或当时不相关的客户端保存历史。因此持久状态仍然应该使用属性复制。",
    "source": "资料依据：Epic Games · Remote Procedure Calls: NetMulticast"
  },
  {
    "id": "261",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "Server RPC 的拥有者检查、参数验证和可靠性选项如何设计？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "客户端只有对拥有连接可解析的 Actor 才能把 Server RPC 发到服务器，服务端实现仍要验证参数、权限和调用频率。Reliable 适合低频且必须到达的命令，高频输入更适合可丢弃或批量协议，避免可靠队列阻塞。",
    "source": "资料依据：Epic Games · Remote Procedure Calls: Server RPC"
  },
  {
    "id": "262",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "Client RPC 如何定位目标连接，何时会因 Actor 没有正确所有者而失效？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "Client RPC 由服务器在具有目标 OwningConnection 的 Actor 上调用，通常发送给该拥有客户端。Actor 没有正确所有者或调用发生在错误端时不会到达预期连接，应该把调用放在 PlayerController、Pawn 或其拥有组件等明确网络所有权链上。",
    "source": "资料依据：Epic Games · Remote Procedure Calls: Client RPC"
  },
  {
    "id": "263",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "Reliable RPC 的顺序与重传保证是什么，为什么不能替代状态复制？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "Reliable RPC 在连接存续且通道有效时保证传送并保持同一通道上的可靠顺序。但是前面的包丢失会阻塞后续可靠消息。它不会为重连或晚加入重放历史，也只表达事件而不是最新状态。所以连续状态仍然应该交给属性复制。",
    "source": "资料依据：Epic Games · Remote Procedure Calls: Reliability"
  },
  {
    "id": "264",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "组件复制开关、注册顺序和网络角色如何影响组件状态同步？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "组件状态复制要求拥有 Actor 已复制，组件本身通过 SetIsReplicatedByDefault 或 SetIsReplicated 启用复制，并在服务器以可复制方式创建和注册。组件网络角色来自拥有 Actor 的连接上下文，客户端本地动态组件不会自动与服务器组件配对。",
    "source": "资料依据：Epic Games · Component Replication"
  },
  {
    "id": "265",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "ReplicateSubobjects 如何与子对象生命周期、所有权和带宽协同？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "复制子对象必须由服务器创建并与复制 Actor 保持稳定归属，再通过注册子对象列表或 Actor 的子对象复制路径送入该 ActorChannel。销毁前要从复制列表移除并处理引用失效，频繁创建的大量子对象还需要评估通道和带宽成本。",
    "source": "资料依据：Epic Games · Replicating UObjects and Subobjects"
  },
  {
    "id": "266",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "Fast Array Serializer 的标记、增量变更和删除通知如何工作？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "FFastArraySerializer 的元素继承 FFastArraySerializerItem，服务器修改后调用 MarkItemDirty，结构性清空等操作使用 MarkArrayDirty。客户端通过 PreReplicatedRemove、PostReplicatedAdd 和 PostReplicatedChange 处理增量通知，遗漏脏标记就不会可靠发送变化。",
    "source": "资料依据：Epic Games · Fast TArray Replication"
  },
  {
    "id": "267",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "NetDeltaSerialize 需要满足哪些 traits 和序列化契约，如何处理版本变化？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "自定义结构通过 TStructOpsTypeTraits 声明 WithNetDeltaSerializer，并在 NetDeltaSerialize 中遵守 FNetDeltaSerializeInfo 的映射、基线和成功返回契约。改变字段或位布局时要配合网络版本或兼容分支并提供默认值，不能让新旧端按不同顺序读取同一数据流。",
    "source": "资料依据：Epic Games · Custom NetDeltaSerialize"
  },
  {
    "id": "268",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "FArchive 序列化与网络复制、SaveGame 序列化的边界如何区分？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "FArchive 是通用序列化抽象，包保存、事务和存档会设置不同 Archive 标志。网络复制还使用 PackageMap、NetSerialize 或 NetDeltaSerialize 等连接相关机制。SaveGame 只应该保存可持久化业务数据，不能把磁盘格式、网络线格式和任意 UObject 包序列化当成同一协议。",
    "source": "资料依据：Epic Games · Serialization, SaveGame, and Network Replication"
  },
  {
    "id": "269",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "SaveGame 标记、Transient 属性和对象引用在保存恢复时如何取舍？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "SaveGame specifier 只有在 ArIsSaveGame 的存档流程中才会筛选字段，Transient 属性通常不进入持久化数据。运行时 UObject 指针跨会话往往没有意义，应该保存软路径、主资产 ID 或自定义稳定标识，并在加载后重新解析对象。",
    "source": "资料依据：Epic Games · Saving and Loading Your Game"
  },
  {
    "id": "270",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "USaveGame 数据升级时如何设计版本号、兼容读取和迁移路径？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "USaveGame 数据应包含显式 schema 版本和稳定键，加载旧版本时按版本逐步填充新默认值或迁移结构。未知的更高版本应该明确拒绝或走兼容读取，不能依赖属性顺序和数组索引永远不变。",
    "source": "资料依据：Epic Games · SaveGame Versioning and Migration"
  },
  {
    "id": "271",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "客户端重连后，哪些状态依靠复制重建，哪些状态需要额外恢复协议？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "重连后仍存在且与连接相关的服务器 Actor 会通过属性复制重建当前权威快照，旧 RPC 和客户端瞬时对象不会自动重放。账户、库存、任务进度和已销毁 Actor 等跨连接状态需要服务器会话、PlayerState 恢复或持久化协议重新注入。",
    "source": "资料依据：Epic Games · Reconnect State and Actor Replication"
  },
  {
    "id": "272",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "NetUpdateFrequency 与优先级、带宽预算和状态延迟之间如何权衡？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "NetUpdateFrequency 限制 Actor 被考虑发送的频率，最终延迟还受相关性、优先级、休眠和连接带宽预算影响。只应提高真正延迟敏感对象的频率，其他状态可用休眠、量化、Push Model 或 Replication Graph 减少无效流量。",
    "source": "资料依据：Epic Games · Actor Relevancy, Priority, and Update Frequency"
  },
  {
    "id": "273",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "Runtime 模块的公开 API、依赖和打包边界应如何定义？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "Runtime 模块的 Public 目录只暴露稳定接口和必要反射类型，具体实现与重依赖应放在 Private，并在 Build.cs 中声明最小依赖。模块描述必须是 Runtime 类型且不能依赖 UnrealEd 等编辑器模块，才能进入非编辑器目标和打包产物。",
    "source": "资料依据：Epic Games · Unreal Engine Runtime Modules"
  },
  {
    "id": "274",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "Editor 模块如何隔离编辑器依赖，避免运行时目标加载不必要代码？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "编辑器功能应放入 Type 为 Editor 的模块，由该模块依赖 UnrealEd、LevelEditor 等编辑器 API，Runtime 模块只暴露共享契约。非编辑器目标不会编译或加载 Editor 模块，少量条件代码也必须用目标规则和 WITH_EDITOR 边界隔离。",
    "source": "资料依据：Epic Games · Creating an Editor Module"
  },
  {
    "id": "275",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "PublicDependencyModuleNames 如何与 Public 头文件暴露的依赖保持一致？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "若 Public 头文件包含、继承或在公开签名中需要另一个模块的完整类型，该模块应列入 PublicDependencyModuleNames。只在 cpp 或 Private 头文件使用的实现依赖放入 PrivateDependencyModuleNames，前向声明可减少但不能掩盖公开 ABI 所需定义。",
    "source": "资料依据：Epic Games · Module Properties in Build.cs: Public Dependencies"
  },
  {
    "id": "276",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "PrivateDependencyModuleNames 何时足够，哪些 include 会迫使依赖升级为 Public？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "PrivateDependencyModuleNames 足以支撑本模块私有源文件中的 include 和链接，不会把依赖传递给包含本模块 Public 头的消费者。公开内联代码、模板、基类、按值成员或必须包含的反射类型若来自该模块，就需要把依赖提升为 Public。",
    "source": "资料依据：Epic Games · Module Properties in Build.cs: Private Dependencies"
  },
  {
    "id": "277",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "UHT 扫描反射类型时，模块依赖和生成代码可见性需要满足什么条件？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "UHT 扫描公开反射声明时必须能解析其中引用的 UCLASS、USTRUCT 和 UENUM，生成代码随后还要链接这些类型的注册符号。对应模块应出现在 Build.cs 依赖中，跨模块类需要正确 API 导出，generated.h 仍必须是该头文件最后的 include。",
    "source": "资料依据：Epic Games · Unreal Header Tool and Module Dependencies"
  },
  {
    "id": "278",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "插件 LoadingPhase 与模块启动顺序、编辑器工具可用时机有什么关系？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "LoadingPhase 决定模块在 PreDefault、Default、PostEngineInit 等引擎阶段何时收到 StartupModule，不保证其依赖对象已经完成业务初始化。插件工具应选择满足所需编辑器服务的最晚合理阶段，并用模块依赖或显式加载保证其他模块可用。",
    "source": "资料依据：Epic Games · Module Descriptors and LoadingPhase"
  },
  {
    "id": "279",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "第三方库的库文件、头文件和运行时 DLL 如何在 Build.cs 中稳定接入？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "第三方接入通常在 Build.cs 配置头文件路径、PublicAdditionalLibraries、PublicDefinitions 和 PublicDelayLoadDLLs，并用 RuntimeDependencies 把动态库放入打包暂存。库路径要按平台、架构和配置选择，运行时还需要从可部署位置加载 DLL，而不能依赖开发机绝对路径。",
    "source": "资料依据：Epic Games · Integrating Third-Party Libraries"
  },
  {
    "id": "280",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "模块 API 宏如何控制跨模块符号导出，哪些类型不应直接暴露？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "MYMODULE_API 在构建模块时导出符号、在消费模块时导入符号，跨 DLL 使用的非内联类、函数和反射类型需要正确标记。公开接口应该避免暴露第三方 STL 布局或私有实现类型，可用 Unreal 类型、纯接口或 PImpl 缩小 ABI 面。",
    "source": "资料依据：Epic Games · Module API Specifiers"
  },
  {
    "id": "281",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "Replicated subobject 如何随 Actor 所有权和通道状态建立？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "服务器创建的 UObject 子对象应具有稳定的 Actor Outer 或明确归属，并在 ActorChannel 有效时通过注册子对象列表或 ReplicateSubobjects 路径复制。客户端对象由通道创建或解析，服务器销毁前要取消注册并同步引用失效，不能把本地 NewObject 当成同一网络实例。",
    "source": "资料依据：Epic Games · Replicating UObjects with Actor Channels"
  },
  {
    "id": "282",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "FastArraySerializer 如何只同步变化元素并处理重连？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "Fast Array 对每个连接维护增量基线，只发送已标脏的新增、修改和删除。新连接或重连会从当前服务器数组建立新的基线。元素应有稳定复制 ID，客户端从回调重建派生状态，不能依赖断线期间每个历史删除事件都会重放。",
    "source": "资料依据：Epic Games · Fast TArray Replication and Reconnects"
  },
  {
    "id": "283",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "Reliable RPC 堆积时怎样避免网络拥塞和顺序阻塞？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "Reliable RPC 会在丢包时重传并保持顺序，持续高频发送会造成队首阻塞、通道积压甚至连接超时。每帧状态应改为属性复制或 Unreliable 消息，并通过合并、限频和只发送最新意图控制可靠流量。",
    "source": "资料依据：Epic Games · Reliable RPC Queues and Network Saturation"
  },
  {
    "id": "284",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "TObjectPtr 在编辑器、序列化和运行时 GC 中分别提供什么保证？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "TObjectPtr 在编辑器和序列化管线中提供可跟踪的 UObject 引用表示，运行时通过指针式接口访问目标。真正的 GC 保证来自 UPROPERTY、引用收集器或根集合等可达路径，单独把裸指针类型换成 TObjectPtr 并不会让未反射存储自动成为强引用。",
    "source": "资料依据：Epic Games · Object Pointers and TObjectPtr Guarantees"
  },
  {
    "id": "285",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "TWeakObjectPtr 失效后如何安全地恢复或放弃异步结果？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "TWeakObjectPtr 失效表示原 UObject 已不能安全访问，它不能把被销毁对象重新变回有效实例。异步结果应携带稳定 ID、软路径或任务代次，回到游戏线程后若弱指针无效就丢弃结果，确需恢复时按稳定标识重新解析或加载新对象。",
    "source": "资料依据：Epic Games · Weak Object Pointers in Async Work"
  },
  {
    "id": "286",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "组件注册顺序错误为什么会导致 RootComponent 和 Tick 依赖失效？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "运行时场景组件若在 RootComponent 和附加层级确定前注册，注册时计算的世界变换、渲染和物理状态可能基于错误父级。应先建立根和附件关系，再按层级注册组件，最后添加 Tick 前置关系并启用 Tick，避免把偶然注册顺序当成调度保证。",
    "source": "资料依据：Epic Games · Component Registration Order and Tick Dependencies"
  },
  {
    "id": "287",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "SpawnActorDeferred 允许调用方在哪个阶段设置初始化参数？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "SpawnActorDeferred 返回的 Actor 已完成原生构造。但是 Construction Script、最终组件初始化和 BeginPlay 尚未完成。调用方可以在此阶段写入 ExposeOnSpawn 数据和初始化依赖，随后必须且只能调用一次 FinishSpawning 提交最终变换。",
    "source": "资料依据：Epic Games · Deferred Actor Spawning"
  },
  {
    "id": "288",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "AsyncTask 回到游戏线程时如何检查 UObject 仍然有效？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "后台任务只保存 TWeakObjectPtr，使用 AsyncTask 投递到游戏线程后再通过 Weak.Get 和 IsValid 取得临时有效对象。还要核对 World、关卡或任务代次，防止对象地址有效但已经属于过期游戏会话。",
    "source": "资料依据：Epic Games · AsyncTask Completion on the Game Thread"
  },
  {
    "id": "289",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "动态多播委托为什么需要区分绑定对象和 Lambda 的解绑方式？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "动态多播委托只支持反射 UFUNCTION 绑定，使用 AddDynamic/RemoveDynamic 按对象和函数管理，并不支持普通 Lambda。原生多播委托的 AddLambda 返回 DelegateHandle，需要显式 Remove。涉及 UObject 时可以选择 AddUObject 或 AddWeakLambda 让寿命语义可追踪。",
    "source": "资料依据：Epic Games · Dynamic and Native Multicast Delegates"
  },
  {
    "id": "290",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "插件的 Runtime 模块依赖 Editor 类型时打包阶段会发生什么？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "Runtime 模块引用 Editor 类型会让非编辑器目标缺少模块、头文件或导出符号，UBT、UHT 或链接阶段因此失败，打包也不会携带 Editor 代码。共享接口应该下沉到 Runtime 模块，编辑器实现留在 Editor 模块，并只让编辑器目标声明该依赖。",
    "source": "资料依据：Epic Games · Separating Runtime and Editor Modules"
  },
  {
    "id": "291",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "第三方库的延迟加载和模块卸载怎样避免悬空符号？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "延迟加载只推迟 DLL 解析，模块必须在首次调用外部符号前取得并保存 FPlatformProcess::GetDllHandle 返回的句柄。卸载前要停止线程和回调、销毁库创建的对象并清空函数指针，最后再 FreeDllHandle，避免执行已经卸载的代码。",
    "source": "资料依据：Epic Games · Third-Party Libraries and Delay Loading"
  },
  {
    "id": "292",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "RepNotify 在初始同步和后续属性变化中如何避免重复副作用？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "RepNotify 应该把视觉或派生状态更新写成可重复执行的函数，因为初始同步、重新相关和真实属性变化都可能进入 OnRep。服务器在权威写入后显式调用同一应用函数，客户端可比较旧值或版本号抑制只应发生一次的声音、奖励等副作用。",
    "source": "资料依据：Epic Games · RepNotify Initial and Subsequent Updates"
  },
  {
    "id": "293",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "WorldSubsystem 与 GameInstanceSubsystem 的生命周期边界如何选择？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "与单个 UWorld、关卡 Actor 或世界 Tick 同寿命的服务应该使用 WorldSubsystem，与 GameInstance 同寿命且需要跨普通关卡切换的状态使用 GameInstanceSubsystem。后者不能因为寿命更长就硬持有旧世界 Actor，世界引用仍然需要随地图切换更新。",
    "source": "资料依据：Epic Games · Choosing WorldSubsystem versus GameInstanceSubsystem"
  },
  {
    "id": "294",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "软对象引用在异步加载失败时如何保留可诊断状态？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "TSoftObjectPtr 和 FSoftObjectPath 在资源未加载或加载失败后仍保留可记录的资产路径，可与 FStreamableHandle 及单独的错误状态一起追踪请求。回调应区分取消、路径不存在和解析为空，记录路径后释放句柄。保留路径也允许后续重试。",
    "source": "资料依据：Epic Games · Asynchronous Asset Loading with Soft Object References"
  },
  {
    "id": "295",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "客户端预测结果回滚时哪些状态必须由服务器重新确认？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "服务器快照必须重新确认会影响规则的权威位置、速度、动作序号、资源、冷却和库存等状态，纯表现插值可以由客户端重建。客户端保存带序号的输入，收到校正后回滚到服务器状态并重放尚未确认的输入，而不是覆盖服务器结果。",
    "source": "资料依据：Epic Games · Client Prediction and Server Reconciliation"
  },
  {
    "id": "296",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "取消一个后台任务时如何让回调只执行一次？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "任务使用原子状态或锁把 Pending 只转换到 Completed 或 Cancelled，赢得转换的一方负责投递唯一终态回调。取消不能强制终止已经运行的代码，排队回调仍要检查状态和任务代次，关闭时还需要等待工作结束或安全放弃结果。",
    "source": "资料依据：Epic Games · Task Cancellation and Single Completion"
  },
  {
    "id": "297",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "模块 API 宏遗漏时如何区分导出问题和链接顺序问题？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "遗漏 API 宏通常表现为消费模块链接失败，导出表中找不到声明符号，而定义所在模块自身仍可能编译成功。若符号已正确导出，再检查 Build.cs 的 Public/Private 依赖和目标模块是否链接。单纯调整链接顺序不能补上未导出的 DLL 符号。",
    "source": "资料依据：Epic Games · Module API Specifiers and Link Errors"
  },
  {
    "id": "298",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "编辑器 Construction Script 与运行时 BeginPlay 的副作用如何隔离？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "Construction Script 和 OnConstruction 可能在编辑器、加载、烘焙与运行时生成过程中重复执行，只应确定性地生成组件和预览状态。一次性玩法、存档、网络请求与外部副作用放在 BeginPlay 或显式运行时流程，并在 EndPlay 对称清理。",
    "source": "资料依据：Epic Games · Construction Script versus BeginPlay"
  },
  {
    "id": "299",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "对象销毁通知与异步回调竞态时如何防止再次访问 UObject？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "EndPlay 或 BeginDestroy 时应该标记任务取消、递增代次并解除委托和 Timer，让旧回调无法再提交结果。后台只捕获 TWeakObjectPtr，回到游戏线程后同时检查对象有效性、World 和一次性完成状态，不能在工作线程触碰 UObject。",
    "source": "资料依据：Epic Games · UObject Destruction and Async Callback Races"
  },
  {
    "id": "300",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "自定义网络序列化怎样兼容旧客户端和字段默认值？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "自定义 NetSerialize 必须用确定的字段顺序和显式版本或特性位读取数据，缺失字段赋稳定默认值并检查 Archive 错误。UE 网络通常会拒绝不兼容协议，修改位布局时应该提升网络版本或保留兼容分支，不能期望旧客户端自动跳过未知数据。",
    "source": "资料依据：Epic Games · Custom NetSerialize Version Compatibility"
  },
  {
    "id": "301",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "CreateProcess 的命令行、继承句柄、环境块和启动信息如何正确组合？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "CreateProcessW 会把 lpCommandLine 当作可写缓冲区，STARTUPINFO 的 cb 必须正确设置。Unicode 环境块还要与 CREATE_UNICODE_ENVIRONMENT 配套。句柄继承应该优先用 STARTUPINFOEX 的句柄列表收窄范围，创建成功后父进程及时关闭不再持有的线程、进程和管道句柄。",
    "source": "资料依据：Microsoft Learn · CreateProcessW and STARTUPINFOEX handle inheritance"
  },
  {
    "id": "302",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "进程和线程句柄的访问权限、等待语义和 CloseHandle 责任如何划分？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "进程或线程句柄携带创建或打开时取得的访问权，等待只是在内核对象进入终止信号态后返回，并不会替调用者回收句柄。每个独立获得或复制的真实句柄都由持有者调用一次 CloseHandle，关闭句柄也不会终止仍在运行的进程或线程。",
    "source": "资料依据：Microsoft Learn · Process and thread handles, synchronization and CloseHandle"
  },
  {
    "id": "303",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "句柄继承的筛选方式和安全边界是什么，子进程如何确认继承结果？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "传统继承要求父进程把 bInheritHandles 设为 TRUE，且目标句柄本身带可继承标志，这容易把无关句柄一并泄露给子进程。更稳妥的做法是用 PROC_THREAD_ATTRIBUTE_HANDLE_LIST 明确白名单，并通过约定的命令行、环境或 IPC 协议把这些句柄值交给子进程验证和使用。",
    "source": "资料依据：Microsoft Learn · Inheritance of handles and PROC_THREAD_ATTRIBUTE_HANDLE_LIST"
  },
  {
    "id": "304",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "Job Object 如何限制进程组资源并接收终止通知？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "进程加入 Job 后，可以通过 SetInformationJobObject 设置进程数、CPU、内存以及 JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE 等限制。把 Job 关联到完成端口可接收新进程、退出和资源限制消息。但是消息通知不能代替对 API 返回值与进程退出状态的检查。",
    "source": "资料依据：Microsoft Learn · Job Objects limits and completion port notifications"
  },
  {
    "id": "305",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "WaitForSingleObject 的返回值、超时和等待对象类型有哪些陷阱？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "WAIT_OBJECT_0 表示对象已满足，WAIT_TIMEOUT 只是本次等待超时，WAIT_FAILED 后必须读取 GetLastError。等待互斥体还可能得到 WAIT_ABANDONED。等待尚未结束时关闭该句柄会产生未定义行为，而且 GUI 线程长期无限等待会阻塞消息泵。",
    "source": "资料依据：Microsoft Learn · WaitForSingleObject return values and waitable objects"
  },
  {
    "id": "306",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "线程局部存储的分配、访问和线程退出清理如何设计？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "TlsAlloc 只分配索引，TlsSetValue 保存的是每线程指针，系统不会替应用释放该指针指向的对象。需要退出回调时可使用 FLS，或者让受控线程在返回前执行清理。最后还要由进程级所有者调用 TlsFree 或 FlsFree 释放索引。",
    "source": "资料依据：Microsoft Learn · Thread Local Storage and Fiber Local Storage callbacks"
  },
  {
    "id": "307",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "CreateThread 与 _beginthreadex 对 C 运行库初始化和退出清理有何影响？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "会调用 C 运行库的线程入口通常使用 _beginthreadex，使运行库能够建立并在返回或 _endthreadex 时释放线程状态。CreateThread 适合不依赖这类运行库状态的纯 Win32 入口。无论用哪一种，创建方仍要等待或关闭返回的线程句柄。",
    "source": "资料依据：Microsoft Learn · _beginthreadex and CreateThread runtime-library ownership"
  },
  {
    "id": "308",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "线程优先级与调度、饥饿和实时性之间如何权衡？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "Windows 用进程优先级类和线程相对优先级计算基础优先级，动态提升也会影响实际调度。因此设置值不是确定的执行时限。长期提高优先级可能让输入、I/O 或其他工作线程饥饿，硬实时要求不能依赖普通 Windows 线程优先级来保证。",
    "source": "资料依据：Microsoft Learn · Scheduling priorities and thread priority levels"
  },
  {
    "id": "309",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "用户态 APC 何时执行，alertable wait 和取消流程如何配合？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "QueueUserAPC 只是把回调排入目标线程队列，目标线程进入 SleepEx、WaitForSingleObjectEx 等可警报等待后才会执行它。APC 没有通用的撤回接口，取消应由共享状态或代际标记让回调自行退出，并保证回调捕获的内存在执行前一直有效。",
    "source": "资料依据：Microsoft Learn · Asynchronous Procedure Calls and alertable waits"
  },
  {
    "id": "310",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "临界区初始化、递归进入、争用和删除时有哪些生命周期要求？",
    "difficulty": 4,
    "scopes": [
      "Win32"
    ],
    "answer": "CRITICAL_SECTION 只能用于同一进程，允许同一线程递归进入。但是每次进入都必须有对应的 LeaveCriticalSection。DeleteCriticalSection 前必须确保没有线程持有或等待它，删除后再次进入属于未定义行为。因此锁对象应比所有使用线程活得更久。",
    "source": "资料依据：Microsoft Learn · Critical section objects and lifecycle"
  },
  {
    "id": "311",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "命名互斥体与进程内锁的权限、递归和异常退出语义如何比较？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "Mutex 是可命名、可跨进程等待的内核对象，创建和打开受安全描述符控制，同一拥有线程可以递归获取。拥有线程异常结束时等待者会收到 WAIT_ABANDONED。临界区或 SRW lock 更轻量但限于进程内，也没有这套 abandoned 语义。",
    "source": "资料依据：Microsoft Learn · Mutex objects, ownership and abandoned state"
  },
  {
    "id": "312",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "信号量计数、ReleaseSemaphore 和等待失败路径如何避免超发？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "等待成功会把信号量计数减一，ReleaseSemaphore 按指定数量增加计数，增加后超过创建时最大值会失败且计数不变。代码应该只为已成功取得的许可释放一次，并用作用域对象记录许可所有权，避免超时或异常分支误释放。",
    "source": "资料依据：Microsoft Learn · Semaphore objects and ReleaseSemaphore limits"
  },
  {
    "id": "313",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "手动重置与自动重置事件如何选择，如何避免丢失唤醒？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "自动重置事件通常释放一个等待者后自动回到无信号态，手动重置事件会保持有信号态，直到调用 ResetEvent，并可唤醒所有现有等待者。事件只保存一个信号位，连续 SetEvent 不会累计次数。需要计数语义时应该使用信号量或受锁保护的条件状态。",
    "source": "资料依据：Microsoft Learn · Event objects, manual-reset and auto-reset semantics"
  },
  {
    "id": "314",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "SRW lock 的共享、独占、递归和升级边界是什么？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "SRW lock 支持共享读和独占写，体积小且无需显式销毁。但是不保证公平，也不能递归获取独占锁。API 没有原子升级或降级操作，释放共享锁再获取独占锁之间状态可能变化，必须重新检查受保护条件。",
    "source": "资料依据：Microsoft Learn · Slim Reader Writer locks"
  },
  {
    "id": "315",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "条件变量如何与 CRITICAL_SECTION 或 SRWLOCK 配合处理虚假唤醒？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "SleepConditionVariableCS 或 SleepConditionVariableSRW 会原子释放锁并进入等待，返回前重新取得锁。但是返回可能来自虚假或被其他线程抢先消费的唤醒。等待方必须在同一把锁下用循环重新检查谓词，超时和错误也要作为独立结果处理。",
    "source": "资料依据：Microsoft Learn · Condition variables with critical sections and SRW locks"
  },
  {
    "id": "316",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "Interlocked 原子操作的内存序和 ABA 风险如何评估？",
    "difficulty": 4,
    "scopes": [
      "Win32"
    ],
    "answer": "常规 Interlocked 操作对目标值提供原子读改写，并在 Windows 支持的平台上形成完整内存屏障。带 Acquire、Release 或 NoFence 后缀的变体只提供标明的排序。比较交换只比较位模式，值从 A 变到 B 又回到 A 时仍会成功，版本计数、带标签指针或受锁回收才能处理 ABA。",
    "source": "资料依据：Microsoft Learn · Interlocked variable access and memory barriers"
  },
  {
    "id": "317",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "WaitOnAddress 的比较值、唤醒时机和与传统事件的取舍是什么？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "WaitOnAddress 仅在目标内存与给定比较值相等时阻塞，返回后仍须重新读取状态，因为可能发生虚假唤醒或条件已被别的线程改变。修改状态的线程应该在写入后调用 WakeByAddressSingle 或 WakeByAddressAll。它适合进程内轻量等待。但是没有可继承或跨进程的内核事件句柄。",
    "source": "资料依据：Microsoft Learn · WaitOnAddress and WakeByAddress functions"
  },
  {
    "id": "318",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "InitOnceExecuteOnce 如何保证一次性初始化，并处理初始化失败？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "INIT_ONCE 以 INIT_ONCE_STATIC_INIT 或 InitOnceInitialize 建立状态，多个调用者只会让一个线程执行同步初始化回调。回调返回 FALSE 时本次初始化不提交，其他调用可以重试。因此失败产生的临时资源必须由回调自己回滚。",
    "source": "资料依据：Microsoft Learn · One-time initialization with InitOnceExecuteOnce"
  },
  {
    "id": "319",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "如何从四个必要条件定位和打破死锁？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "死锁要求互斥、持有并等待、不可剥夺和循环等待同时成立，线程转储或 Wait Chain Traversal 可以帮助找出实际等待环。工程上通常用固定锁顺序、一次取得多把锁、缩短持锁范围或可超时协议打破其中至少一个条件。",
    "source": "资料依据：Microsoft Learn · Deadlock detection and Wait Chain Traversal"
  },
  {
    "id": "320",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "多把锁的全局顺序如何约定，异常路径怎样保持同一顺序？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "所有代码路径应该按稳定键定义同一获取顺序，例如对象地址、层级编号或资源 ID，并以逆序释放。锁守卫把释放绑定到作用域，批量操作则先排序并在任一获取失败时回滚已经持有的锁，避免异常分支破坏约定。",
    "source": "资料依据：Microsoft Learn · Synchronization best practices and lock ordering"
  },
  {
    "id": "321",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "线程退出时 TLS 回调、析构和 DLL 卸载的先后关系如何确认？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "DLL 的线程分离通知和 TLS 回调发生在加载器控制的退出流程中并受 loader lock 约束，回调里不能等待可能再次取得该锁的线程。TerminateThread、进程强制终止或 DisableThreadLibraryCalls 会改变甚至跳过部分通知，关键资源不能只依赖这些回调回收。",
    "source": "资料依据：Microsoft Learn · Dynamic-link library thread-local storage and DllMain notifications"
  },
  {
    "id": "322",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "进程正常退出、TerminateProcess 和 DLL 卸载时的清理保证有什么不同？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "正常返回或 ExitProcess 会终止其他线程并执行进程分离通知。但是通知运行在受限的加载器环境中，不适合复杂协作式清理。TerminateProcess 会直接终止所有线程而不执行附加 DLL 的正常退出代码，系统只保证回收内核拥有的进程资源，应用数据可能未提交。",
    "source": "资料依据：Microsoft Learn · Terminating a process and DLL process detach behavior"
  },
  {
    "id": "323",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "WSAStartup 与 WSACleanup 的版本协商和配对规则是什么？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "WSAStartup 返回的 WSADATA 给出实际协商版本，调用方应该检查该版本是否满足需求，失败时不能继续调用 Winsock。每次成功的 WSAStartup 都要有一次 WSACleanup 配对，库或模块应该明确由谁持有这段进程级初始化生命周期。",
    "source": "资料依据：Microsoft Learn · WSAStartup version negotiation and WSACleanup"
  },
  {
    "id": "324",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "阻塞、非阻塞和重叠 socket 的错误码与线程模型如何区分？",
    "difficulty": 4,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "阻塞 socket 可以让调用线程等待，非阻塞 socket 在暂时无法推进时返回 SOCKET_ERROR 和 WSAEWOULDBLOCK，调用方依赖 readiness 通知重试。重叠 I/O 则让每个操作携带 OVERLAPPED 和稳定缓冲区，WSA_IO_PENDING 表示稍后通过事件、回调或 IOCP 报告完成，它与非阻塞模式不是同一概念。",
    "source": "资料依据：Microsoft Learn · Winsock blocking, nonblocking and overlapped I/O"
  },
  {
    "id": "325",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "监听 socket 的地址绑定、backlog 和 accept 失败路径如何设计？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "服务端依次 bind 本地地址、listen 建立等待队列，再由 accept 为每个连接返回新的 socket。监听 socket 本身继续接收后续连接。backlog 是实现可调整的待处理连接提示，accept 失败时只处理对应错误并继续或停止监听，不能把监听句柄当成已连接句柄关闭。",
    "source": "资料依据：Microsoft Learn · Binding, listening and accepting Winsock connections"
  },
  {
    "id": "326",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "非阻塞 connect 如何检测完成、超时并安全关闭 socket？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "非阻塞 connect 返回 WSAEWOULDBLOCK 后，socket 可写只表示连接尝试结束，仍要读取 SO_ERROR 判断成功或具体错误。超时由应用自己的计时器和 readiness 等待实现，判定失败后关闭该 socket，并为重试创建新的连接状态，避免晚到事件污染下一次尝试。",
    "source": "资料依据：Microsoft Learn · Nonblocking connect completion and SO_ERROR"
  },
  {
    "id": "327",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "TCP 不保留消息边界时，应用层如何处理拆包、粘包和半关闭？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "TCP 只提供有序字节流，一次 send 与一次 recv 没有对应关系，应用协议必须用固定长度、长度前缀或可靠分隔符完成帧解析。recv 返回 0 表示对端完成有序关闭，仍然应该按协议处理已缓存的完整帧，并用 shutdown 表达本端不再发送或接收的方向。",
    "source": "资料依据：IETF RFC · RFC 9293 TCP byte stream and connection closing"
  },
  {
    "id": "328",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "SO_REUSEADDR 等复用选项在 Windows 上的语义和端口冲突风险是什么？",
    "difficulty": 2,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "Windows 的 SO_REUSEADDR 可能允许套接字强制绑定已被占用的地址，多个套接字收到流量的行为并不可靠。因此不应该照搬其他系统的服务器习惯。需要独占监听端口时使用 SO_EXCLUSIVEADDRUSE，并在 bind 前设置，权限和重启策略也要纳入部署设计。",
    "source": "资料依据：Microsoft Learn · SO_REUSEADDR and SO_EXCLUSIVEADDRUSE"
  },
  {
    "id": "329",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "select 与 WSAPoll 的容量限制和可扩展性如何比较？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "select 每次都扫描 fd_set，Windows 默认 FD_SETSIZE 还限制集合容量，调用后集合会被改写，下一轮必须重建。WSAPoll 也按数组扫描，接口更适合动态集合但仍是 readiness 模型。大规模并发 I/O 通常转向 IOCP，而不是把轮询数组无限放大。",
    "source": "资料依据：Microsoft Learn · select, fd_set and WSAPoll"
  },
  {
    "id": "330",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "WSAEventSelect 的网络事件位、重置方式和非阻塞要求是什么？",
    "difficulty": 2,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "WSAEventSelect 把指定 FD_* 事件关联到事件对象，并自动把 socket 置为非阻塞模式。事件被置位后应该调用 WSAEnumNetworkEvents 读取每一位及其错误码，同时完成事件状态重置。只调用 ResetEvent 会丢失 Winsock 维护的事件信息。",
    "source": "资料依据：Microsoft Learn · WSAEventSelect and WSAEnumNetworkEvents"
  },
  {
    "id": "331",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "send 返回小于请求长度时，发送缓冲区和重试策略如何设计？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "流式 socket 的 send 成功值只是本次接受的字节数，应用需要记录偏移并继续发送剩余数据，不能把短写当成完整消息。非阻塞模式遇到 WSAEWOULDBLOCK 后等待可写事件，重叠模式则让缓冲区保持有效直到完成通知，再推进发送队列。",
    "source": "资料依据：Microsoft Learn · Winsock send return values and partial sends"
  },
  {
    "id": "332",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "recv 返回 0、SOCKET_ERROR 和正数分别表示什么状态？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "对面向连接的字节流，正数是实际收到的字节数，0 表示对端已经有序关闭发送方向，SOCKET_ERROR 后用 WSAGetLastError 判断可重试或致命错误。无连接报文可以合法携带零长度数据。因此不能在所有 socket 类型上把 0 一律解释为断线。",
    "source": "资料依据：Microsoft Learn · Winsock recv return values and graceful close"
  },
  {
    "id": "333",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "shutdown 的方向参数与 TCP FIN 如何表达半关闭？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "shutdown(SD_SEND) 禁止后续发送，并在已排队数据发出后启动 TCP 的有序关闭，接收方向仍可继续读取对端数据。shutdown 不是 closesocket，协议交换结束后仍要关闭句柄。SD_RECEIVE 和 SD_BOTH 的选择也必须与应用层状态机一致。",
    "source": "资料依据：Microsoft Learn · Winsock shutdown and graceful connection closure；IETF RFC · RFC 9293 TCP half-close"
  },
  {
    "id": "334",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "SO_KEEPALIVE 与应用层心跳、探测间隔和断线检测如何取舍？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "SO_KEEPALIVE 在连接长时间空闲后用传输层探测判断对端是否仍可达，默认周期通常不适合快速故障发现，具体参数还依赖系统配置或 SIO_KEEPALIVE_VALS。应用层心跳可以携带会话语义并设置业务超时。但是会增加流量。二者解决的层次不同，可以按场景组合。",
    "source": "资料依据：Microsoft Learn · SO_KEEPALIVE and SIO_KEEPALIVE_VALS"
  },
  {
    "id": "335",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "UDP 报文边界、丢包、乱序和接收缓冲区限制如何处理？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "UDP 保留每个数据报的边界。但是不保证送达、顺序、唯一性或拥塞控制，可靠性需要应用协议自己定义序号、重传和去重。接收缓冲区小于报文时 Winsock 可能返回 WSAEMSGSIZE 并截断数据，协议应限制最大报文并把分片风险纳入设计。",
    "source": "资料依据：IETF RFC · RFC 768 User Datagram Protocol semantics；Microsoft Learn · Winsock datagram sockets and WSAEMSGSIZE"
  },
  {
    "id": "336",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "IPv4 与 IPv6 双栈监听和 IPv4-mapped 地址有哪些兼容问题？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "双栈服务通常用 getaddrinfo(AF_UNSPEC) 遍历可用地址，并显式决定 IPv6 socket 的 IPV6_V6ONLY 策略，不能假设所有系统默认值相同。允许双栈时 IPv4 客户端可能以 IPv4-mapped IPv6 地址出现，日志、访问控制和地址比较必须先规范化表示。",
    "source": "资料依据：Microsoft Learn · Dual-stack sockets and IPv4-mapped IPv6 addresses"
  },
  {
    "id": "337",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "getaddrinfo 的 hints、地址遍历和异步解析失败如何处理？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "hints 用 family、socktype 和 protocol 限定结果，调用方应该遍历链表逐个尝试创建与连接，而不是只使用第一项。每个失败的 socket 都要关闭，结果用 freeaddrinfo 释放。不能阻塞的线程可使用 GetAddrInfoEx 等异步接口并区分解析错误与连接错误。",
    "source": "资料依据：Microsoft Learn · getaddrinfo and GetAddrInfoEx name resolution"
  },
  {
    "id": "338",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "OVERLAPPED、缓冲区和完成通知的生命周期如何保证？",
    "difficulty": 4,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "每个未完成操作需要独立且稳定的 OVERLAPPED，相关 WSABUF、数据内存和连接上下文都必须保留到最终完成通知到达。函数立即返回成功也不能随意复用这些对象，因为完成通知策略可能仍会投递。释放时应该以观察到该操作的最终完成为边界。",
    "source": "资料依据：Microsoft Learn · Overlapped I/O and completion notification lifecycle"
  },
  {
    "id": "339",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "IOCP 完成键如何关联连接上下文，工作线程如何区分不同 I/O 类型？",
    "difficulty": 4,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "CreateIoCompletionPort 把句柄与一个完成键关联，后续完成包会带回该键以及发起操作的 OVERLAPPED 指针。常见做法是让完成键指向连接上下文，让自定义 OVERLAPPED 容器记录接收、发送或控制操作类型，工作线程据此分派并维护所有权。",
    "source": "资料依据：Microsoft Learn · I/O completion ports and completion keys"
  },
  {
    "id": "340",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "GetQueuedCompletionStatus 的返回值和退出哨兵如何判断？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "返回 TRUE 表示取到成功完成。返回 FALSE 且 lpOverlapped 非空表示取到失败的 I/O 完成，此时 GetLastError 是该操作错误。返回 FALSE 且 lpOverlapped 为空通常是超时或端口错误，退出工作线程可用 PostQueuedCompletionStatus 投递约定的专用哨兵包。",
    "source": "资料依据：Microsoft Learn · GetQueuedCompletionStatus result interpretation"
  },
  {
    "id": "341",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "同一 socket 排队多个 recv 时，缓冲区所有权和完成顺序如何管理？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "每个 WSARecv 都要有独立的 OVERLAPPED 和缓冲区，直到对应完成包被处理前都不能移动或复用。即使传输层按序提供字节，多个工作线程取得完成包和执行回调的时间仍可能交错，连接层应该按操作序号串行提交解析结果。",
    "source": "资料依据：Microsoft Learn · Overlapped WSARecv ordering and buffer ownership"
  },
  {
    "id": "342",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "CancelIoEx、closesocket 与未完成 Winsock I/O 的竞态如何处理？",
    "difficulty": 4,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "CancelIoEx 只请求取消指定句柄上的匹配操作，操作可能已经完成、无法找到或最终以 ERROR_OPERATION_ABORTED 完成。closesocket 也会触发未完成操作结束。但是应用仍要排空完成通知后再释放 OVERLAPPED、缓冲区和连接对象，不能把发出取消当成生命周期终点。",
    "source": "资料依据：Microsoft Learn · CancelIoEx and cancellation of overlapped Winsock I/O"
  },
  {
    "id": "343",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "TCP_NODELAY 对小包延迟、吞吐和应用层批量发送有什么影响？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "TCP_NODELAY 禁用 Nagle 算法，可减少小写入等待未确认数据的延迟。但是可能产生更多小包并降低链路效率。实时交互可以启用它，同时仍然应该在应用层合并同一帧可一起发送的数据。批处理吞吐场景通常不必默认关闭 Nagle。",
    "source": "资料依据：Microsoft Learn · TCP_NODELAY socket option；IETF RFC · RFC 9293 Nagle algorithm"
  },
  {
    "id": "344",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "TLS 握手、证书验证和底层 socket 生命周期如何分层管理？",
    "difficulty": 4,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "TLS 层应该把 Schannel 或其他实现的握手状态、加密缓冲区与底层 socket 的收发状态分开，非阻塞握手可能需要多轮读写才能完成。客户端必须验证证书链、主机名和策略，关闭时尽量发送 close_notify，随后再结束 socket，并让所有异步操作完成后释放两层状态。",
    "source": "资料依据：Microsoft Learn · Schannel TLS handshake and certificate validation；IETF RFC · RFC 8446 TLS 1.3 closure alerts"
  },
  {
    "id": "345",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "LoadLibraryEx 的搜索路径、标志和模块引用计数如何控制？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "LoadLibraryEx 应该使用绝对路径或 LOAD_LIBRARY_SEARCH_* 标志限定依赖搜索目录，避免依赖当前目录和旧式默认顺序。每次成功加载通常增加模块引用计数，拥有该引用的代码用 FreeLibrary 配对。GetModuleHandle 得到的句柄不增加计数，不能按同样方式释放。",
    "source": "资料依据：Microsoft Learn · LoadLibraryEx search flags and module reference counts"
  },
  {
    "id": "346",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "GetProcAddress 的名称修饰、序号导出和函数签名如何保证 ABI 一致？",
    "difficulty": 4,
    "scopes": [
      "Win32"
    ],
    "answer": "GetProcAddress 按导出表中的精确名称或序号查找，不会替调用方推断 C++ 名字修饰。序号还可能在稀疏导出表中得到无效的非空地址。调用端 typedef 必须与导出函数的参数、返回值和调用约定完全一致，跨编译器边界通常使用 extern \"C\" 和稳定的 C ABI。",
    "source": "资料依据：Microsoft Learn · GetProcAddress exported names and calling conventions"
  },
  {
    "id": "347",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "DllMain 中哪些操作受 loader lock 限制，初始化逻辑应如何拆分？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "DllMain 在 loader lock 下运行，不能调用可能再次加载 DLL、等待其他线程或取得与加载器顺序冲突的锁的代码，复杂的 COM、线程和同步初始化也应该避免。入口只保留无依赖的最小状态设置，把可能失败的工作放到导出的显式 Initialize 或首次使用路径。",
    "source": "资料依据：Microsoft Learn · Dynamic-link library best practices and loader lock"
  },
  {
    "id": "348",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "FreeLibrary 如何与线程回调、静态析构和仍在执行的函数协调？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "卸载前必须停止新调用、取消并等待异步工作、解绑回调，确认没有线程的指令指针或对象虚表仍指向该模块。执行模块代码的线程若自行卸载，应该使用 FreeLibraryAndExitThread 原子完成两步，避免 FreeLibrary 返回后线程又执行已经解除映射的代码。",
    "source": "资料依据：Microsoft Learn · FreeLibraryAndExitThread and DLL unloading"
  },
  {
    "id": "349",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "CreateFile 的访问权、共享模式、创建选项和安全属性如何组合？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "dwDesiredAccess 表示本次需要的读写权，dwShareMode 必须与所有已打开句柄彼此兼容，dwCreationDisposition 决定创建、覆盖或仅打开。SECURITY_ATTRIBUTES 同时控制安全描述符和句柄是否可继承，文件属性与 FILE_FLAG_* 则影响缓存、目录和重叠 I/O 行为。",
    "source": "资料依据：Microsoft Learn · CreateFile access, sharing and creation disposition"
  },
  {
    "id": "350",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "跨进程传递句柄时，继承和 DuplicateHandle 应如何选择？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "继承只适合创建子进程时传递预先标记且列入白名单的句柄，关系简单但需要同步传递句柄值。DuplicateHandle 可向已有目标进程创建真实句柄副本，并可缩减访问权。发送方和接收方必须约定谁关闭各自副本以及进程退出时的错误处理。",
    "source": "资料依据：Microsoft Learn · Handle inheritance and DuplicateHandle between processes"
  },
  {
    "id": "351",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "DuplicateHandle 的源、目标进程权限和关闭责任如何划分？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "调用者需要能以 PROCESS_DUP_HANDLE 访问源进程和目标进程，dwDesiredAccess 可限制新句柄权限，DUPLICATE_SAME_ACCESS 则复制原访问权。复制成功后两个句柄相互独立，除非明确使用 DUPLICATE_CLOSE_SOURCE。否则源端和目标端各自负责关闭自己的句柄。",
    "source": "资料依据：Microsoft Learn · DuplicateHandle access rights and ownership"
  },
  {
    "id": "352",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "ReadFile 与 WriteFile 的同步、偏移和缓冲区生命周期如何处理？",
    "difficulty": 4,
    "scopes": [
      "Win32"
    ],
    "answer": "同步句柄通常使用并更新文件指针。以 FILE_FLAG_OVERLAPPED 打开的句柄应为每个操作提供独立 OVERLAPPED，并在 Offset 和 OffsetHigh 中指定位置。缓冲区和 OVERLAPPED 在操作最终完成前必须保持有效，返回 ERROR_IO_PENDING 只表示请求已经排队。",
    "source": "资料依据：Microsoft Learn · Synchronous and asynchronous ReadFile and WriteFile"
  },
  {
    "id": "353",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "FlushFileBuffers 保证到哪一层持久性，调用频率如何权衡？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "FlushFileBuffers 请求把指定文件句柄的缓冲信息写向存储设备。但是最终耐久性仍受硬件缓存和设备实现影响，网络文件系统也可能有不同语义。它会显著增加延迟和写放大，事务系统通常按提交边界批量刷新，而不是每个小写入都调用。",
    "source": "资料依据：Microsoft Learn · FlushFileBuffers durability and performance"
  },
  {
    "id": "354",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "CreateFileMapping 的保护属性、映射大小和命名冲突如何设计？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "映射保护必须与底层文件句柄的访问权兼容，最大大小为零时采用当前文件长度，非零大小可能扩展可写文件。命名映射与其他命名内核对象共享命名空间，创建后用 GetLastError 检查 ERROR_ALREADY_EXISTS，并验证既有对象的大小、协议和权限。",
    "source": "资料依据：Microsoft Learn · CreateFileMapping protection, size and named objects"
  },
  {
    "id": "355",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "MapViewOfFile 的偏移对齐、视图权限和解除映射顺序是什么？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "映射偏移必须按系统分配粒度对齐，视图访问标志还要与 CreateFileMapping 的保护方式兼容。使用结束后先停止所有访问并调用 UnmapViewOfFile，再关闭映射句柄和文件句柄。关闭映射句柄本身不会自动解除仍存在的视图。",
    "source": "资料依据：Microsoft Learn · MapViewOfFile offset alignment and view lifetime"
  },
  {
    "id": "356",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "跨进程共享内存的同步、版本布局和异常退出清理如何保证？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "共享区应该使用固定宽度字段、偏移和显式版本，不能存放只在某一进程有效的裸指针或进程私有对象布局。读写通过命名同步对象或无锁协议协调，并在头部记录状态与代际。进程异常退出后内核句柄会回收。但是半写数据仍然需要校验和恢复。",
    "source": "资料依据：Microsoft Learn · Creating named shared memory and synchronization objects"
  },
  {
    "id": "357",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "Windows 宽字符 API 与 UTF-8 转换时如何处理长度和非法字符？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "Windows 的 Unicode API 使用 UTF-16，边界转换应该调用 MultiByteToWideChar 和 WideCharToMultiByte 并显式指定 CP_UTF8、输入长度和错误标志。先查询所需长度再分配缓冲区，并明确结果是否包含终止零。使用系统活动代码页会让不可表示字符发生丢失。",
    "source": "资料依据：Microsoft Learn · MultiByteToWideChar and WideCharToMultiByte UTF-8 conversion"
  },
  {
    "id": "358",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "命名内核对象的 Unicode、命名空间和权限边界有哪些陷阱？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "事件、互斥体和文件映射等命名对象通过对象管理器命名，Global\\ 与 Local\\ 前缀决定会话范围，名称比较和类型冲突也必须处理。创建时提供最小权限 DACL，并检查 ERROR_ALREADY_EXISTS，防止低权限进程预创建同名对象造成劫持或拒绝服务。",
    "source": "资料依据：Microsoft Learn · Kernel object namespaces and named object security"
  },
  {
    "id": "359",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "如何避免 CloseHandle 的重复关闭、伪句柄和复用风险？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "CloseHandle 不是幂等操作，成功关闭后句柄值可能很快被系统复用，第二次关闭可能误伤另一个对象，调试器也会报告无效句柄。所有权应封装在唯一句柄类型中并在移动后置空。GetCurrentProcess 等伪句柄不需要也不应该按普通句柄关闭。",
    "source": "资料依据：Microsoft Learn · CloseHandle and pseudo handle rules"
  },
  {
    "id": "360",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "GetCurrentProcess 和 GetCurrentThread 伪句柄何时需要转换为真实句柄？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "伪句柄是调用上下文解释的特殊常量，不可继承，也不需要关闭。GetCurrentThread 在另一个线程中会表示那个调用线程。需要跨进程传递，或让其他线程长期引用原线程对象时，应该使用 DuplicateHandle 生成具有明确访问权且必须关闭的真实句柄。",
    "source": "资料依据：Microsoft Learn · GetCurrentProcess and GetCurrentThread pseudo handles"
  },
  {
    "id": "361",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "使用 C 运行库的线程为什么通常由 _beginthreadex 创建并正常返回？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "_beginthreadex 为线程建立 C 运行库所需的每线程状态，入口函数返回或调用 _endthreadex 时运行库能够释放这些状态。TerminateThread 会跳过栈展开、运行库和 DLL 的正常清理，只能视为进程已无法恢复时的最后手段。",
    "source": "资料依据：Microsoft Learn · _beginthreadex thread termination and CRT cleanup"
  },
  {
    "id": "362",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "线程句柄关闭后如何继续观察线程退出而不泄漏资源？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "关闭最后一个可用线程句柄后，线程仍继续运行。但是调用方失去通过该句柄等待和查询退出码的能力。需要观察退出的组件应该保留或 DuplicateHandle 一份专用句柄，等待结束后立即关闭。线程对象会在终止且所有句柄关闭后由系统删除。",
    "source": "资料依据：Microsoft Learn · Thread handles, waiting and object lifetime"
  },
  {
    "id": "363",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "SRWLock 从共享模式升级到独占模式有什么限制？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "SRWLock 没有共享到独占的原子升级，持有共享锁时直接申请独占锁会造成死锁或未定义的协议行为。正确做法是释放共享锁、获取独占锁后重新验证条件，或者从设计上始终以独占模式保护需要升级的事务。",
    "source": "资料依据：Microsoft Learn · Slim Reader Writer lock acquisition rules"
  },
  {
    "id": "364",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "Wait Chain Traversal 如何定位互斥体导致的线程阻塞？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "OpenThreadWaitChainSession 建立查询会话，GetThreadWaitChain 从目标线程返回线程与同步对象组成的等待链，并标记可检测到的死锁环。结果只是诊断快照，线程状态可能立即变化，实际修复仍要结合转储、锁所有者和代码中的锁顺序确认。",
    "source": "资料依据：Microsoft Learn · Wait Chain Traversal API"
  },
  {
    "id": "365",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "Job Object 如何统一回收子进程和限制资源？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "父进程把相关子进程分配到同一个 Job 后，可集中限制活跃进程数、内存、CPU 和 UI 能力，并用完成端口观察成员变化。设置 JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE 后，最后一个 Job 句柄关闭会终止仍在其中的进程，适合实现进程树级兜底回收。",
    "source": "资料依据：Microsoft Learn · Job Object resource limits and kill-on-close"
  },
  {
    "id": "366",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "AcceptEx 的预投递模型如何安排地址缓冲区和完成通知？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "AcceptEx 需要预先创建接受 socket，并提供足够容纳初始数据及本地、远端地址的输出缓冲区，两个地址区都要为 sockaddr 额外预留 16 字节。完成后用 SO_UPDATE_ACCEPT_CONTEXT 更新接受 socket 的上下文，再解析地址、关联 IOCP 并投递首个接收操作。",
    "source": "资料依据：Microsoft Learn · AcceptEx buffer layout and accept context"
  },
  {
    "id": "367",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "ConnectEx 在绑定本地地址和重用 socket 时有哪些前置条件？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "调用 ConnectEx 前 socket 必须先显式 bind 到本地地址，即使使用通配地址和零端口也不能省略。连接完成后设置 SO_UPDATE_CONNECT_CONTEXT 才能正常使用部分 socket API。若要复用断开的句柄，还要按 DisconnectEx 的 TF_REUSE_SOCKET 契约处理。",
    "source": "资料依据：Microsoft Learn · ConnectEx prerequisites and SO_UPDATE_CONNECT_CONTEXT"
  },
  {
    "id": "368",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "IOCP 工作线程数量如何结合阻塞调用和 CPU 核数设定？",
    "difficulty": 4,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "完成端口的并发值限制同时运行关联工作线程的数量，零值让系统以处理器数量为默认，适合主要执行短 CPU 工作的完成处理。可以创建更多等待线程吸收调度波动。但是回调中若频繁做阻塞 I/O，会占住并发槽，应该把这类工作移出 IOCP 处理路径再测量调参。",
    "source": "资料依据：Microsoft Learn · I/O completion port threads and concurrency value"
  },
  {
    "id": "369",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "WSARecv 的部分完成如何与消息边界和缓冲区所有权协调？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "在流式 socket 上 WSARecv 完成的字节数可能小于缓冲区容量，连接层要把数据追加到帧解析器，不能把一次完成当成一条消息。WSABUF 数组、数据区和 OVERLAPPED 在最终完成前保持稳定，报文 socket 则额外根据 flags 和 WSAEMSGSIZE 处理边界与截断。",
    "source": "资料依据：Microsoft Learn · WSARecv overlapped buffers and message semantics"
  },
  {
    "id": "370",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "CancelIoEx 取消重叠 I/O 后如何判断回调和句柄状态？",
    "difficulty": 4,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "CancelIoEx 成功只表示找到了可请求取消的操作，不保证它尚未正常完成，失败为 ERROR_NOT_FOUND 也可能是完成竞态。无论哪条路径，都以事件、回调或 IOCP 收到最终完成为准，再根据 ERROR_OPERATION_ABORTED 区分取消并释放操作状态。",
    "source": "资料依据：Microsoft Learn · CancelIoEx completion and ERROR_OPERATION_ABORTED"
  },
  {
    "id": "371",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "TCP 半关闭后继续发送为什么可能造成应用协议状态错乱？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "TCP 允许一端收到 FIN 后继续向对端发送。所以传输层半关闭本身是合法状态。若应用协议把 EOF 定义为整个会话结束，继续发送就会与对端状态机冲突。双方必须约定请求结束、响应该结束和最终 closesocket 的顺序。",
    "source": "资料依据：IETF RFC · RFC 9293 TCP half-closed connection state"
  },
  {
    "id": "372",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "LoadLibraryEx 的搜索路径选项如何降低 DLL 劫持风险？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "应用可用 SetDefaultDllDirectories 建立安全的进程级搜索策略，并在 LoadLibraryEx 中组合 LOAD_LIBRARY_SEARCH_SYSTEM32、APPLICATION_DIR 或 DLL_LOAD_DIR 等明确范围。插件目录应该通过 AddDllDirectory 临时加入并妥善移除，避免依赖当前工作目录或可以由低权限用户写入的路径。",
    "source": "资料依据：Microsoft Learn · Dynamic-link library search order and safe search flags"
  },
  {
    "id": "373",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "GetProcAddress 找不到装饰名时如何处理 C 与 C++ 导出？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "C++ 导出名会受编译器、重载、命名空间和调用约定修饰，GetProcAddress 必须使用导出表中的精确字节串，不能用源码函数名猜测。稳定插件接口通常通过 extern \"C\" 加 .def 或显式导出宏固定名称，并用版本化结构传递能力，避免直接暴露编译器 ABI。",
    "source": "资料依据：Microsoft Learn · Exporting from a DLL and GetProcAddress names"
  },
  {
    "id": "374",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "CreateFileMapping 与 MapViewOfFile 的权限如何保持一致？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "PAGE_READONLY、PAGE_READWRITE 等映射保护不能超过底层文件句柄取得的权限，MapViewOfFile 的 FILE_MAP_* 访问也不能超过映射对象保护。权限组合不一致会让创建或映射失败，跨进程打开命名映射时还要让 DACL 授予目标进程所需的最小访问权。",
    "source": "资料依据：Microsoft Learn · File mapping protection and view access rights"
  },
  {
    "id": "375",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "FlushViewOfFile 后为什么还可能需要 FlushFileBuffers？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "FlushViewOfFile 把指定视图范围内的脏页写向底层文件。但是不会刷新所有文件元数据，也不保证物理磁盘缓存已经提交。需要更强提交边界时，刷新视图后再用具有适当权限的文件句柄调用 FlushFileBuffers，并接受相应性能成本。",
    "source": "资料依据：Microsoft Learn · FlushViewOfFile and FlushFileBuffers persistence"
  },
  {
    "id": "376",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "宽字符 API 与 UTF-8 边界如何避免路径转换丢失信息？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "进程内部可以保留 UTF-16 路径并调用带 W 后缀的文件 API，只在网络、配置或跨平台边界按严格 UTF-8 转换。转换使用 CP_UTF8 和错误检测标志，不经系统 ANSI 代码页中转。还要保留规范化、长路径前缀和大小写语义，避免把显示等价误当成同一文件。",
    "source": "资料依据：Microsoft Learn · Unicode in the Windows API and file path conversion"
  },
  {
    "id": "377",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "DuplicateHandle 跨进程传递时如何限制访问权限和关闭责任？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "复制时不设置 DUPLICATE_SAME_ACCESS，改用 dwDesiredAccess 只授予接收方实际需要的权限，可以减少目标进程滥用句柄的能力。IPC 消息必须携带对象类型、句柄值和所有权约定，接收成功后由目标关闭副本，发送失败时发送方仍负责原句柄。",
    "source": "资料依据：Microsoft Learn · DuplicateHandle desired access and cross-process ownership"
  },
  {
    "id": "378",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "命名事件和命名互斥体的安全描述符如何设计？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "创建命名同步对象时应该提供显式 DACL，只允许目标用户、服务 SID 或完整性级别取得 SYNCHRONIZE 和必要的修改权限。调用 CreateEvent 或 CreateMutex 后检查 ERROR_ALREADY_EXISTS，并验证打开的是预期协议对象，避免预创建攻击和跨会话名称碰撞。",
    "source": "资料依据：Microsoft Learn · Synchronization object security and access rights"
  },
  {
    "id": "379",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "WaitForMultipleObjects 超过最大句柄数时如何拆分等待协议？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "WaitForMultipleObjects 一次最多等待 MAXIMUM_WAIT_OBJECTS 个句柄，简单分批会改变 wait-all 原子性，也可能让早批次长期偏置。大规模等待可改用线程池等待、IOCP，或让辅助等待者汇总到少量事件，并明确取消、退出和失败传播协议。",
    "source": "资料依据：Microsoft Learn · WaitForMultipleObjects limits and thread pool waits"
  },
  {
    "id": "380",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "SO_KEEPALIVE 参数与应用层心跳分别解决什么故障？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "SO_KEEPALIVE 关注 TCP 对端或路径在长时间无流量时是否仍可达，探测成功并不表示远端业务线程健康。应用层心跳可验证会话、负载和业务超时，还能携带版本信息。它需要自行处理抖动、拥塞和误判，不能把一次超时直接等同于网络断开。",
    "source": "资料依据：Microsoft Learn · TCP keepalive settings in Winsock；IETF RFC · RFC 9293 TCP keep-alive considerations"
  }
];
