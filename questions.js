window.CPP_INTERVIEW_QUESTIONS = [
  {
    "id": "001",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "inline 关键字有什么作用？它一定会让函数内联展开吗？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "inline 的语言语义主要是允许函数或变量在多个翻译单元中出现等价定义，而非强制编译器展开调用。是否真正执行内联属于优化决定，编译器可以忽略 inline 也可以内联未标记的函数。面试时应该说清楚 inline 解决的是 ODR 层面的重复定义问题，实际展开由优化器决定。",
    "source": "资料依据：cppreference · inline specifier and ODR"
  },
  {
    "id": "002",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "什么是 ODR（单一定义规则）？违反会怎样？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "ODR 要求被使用的非 inline 实体在每个翻译单元中最多只有一个定义，同一实体的多次声明可以存在。inline 函数、inline 变量和模板可以在多个翻译单元出现等价定义，但不一致的定义仍属于未定义行为。",
    "source": "资料依据：cppreference · One Definition Rule"
  },
  {
    "id": "003",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "extern \"C\" 有什么作用？它能转换 C++ 类型吗？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "extern \"C\" 指定 C 语言链接，主要影响函数名的修饰方式和调用约定。它不会把 C++ 类型、重载或异常自动变成 C ABI 可用形式，接口仍应限制为双方都能表示的数据布局。常用于 C++ 与 C 或其他语言的互操作边界。",
    "source": "资料依据：cppreference · language linkage"
  },
  {
    "id": "004",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "constexpr 有什么作用？标记的函数一定在编译期执行吗？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "constexpr 函数具备参与常量求值的资格，但只有实参和执行路径满足常量表达式规则时才必须在编译期求值。C++14 放宽了函数体限制，允许循环和局部变量。不满足常量求值条件的调用仍可作为普通运行期调用。",
    "source": "资料依据：cppreference · constexpr specifier"
  },
  {
    "id": "005",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "auto 类型推导有哪些容易踩坑的地方？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "普通 auto 按模板传值规则推导，会丢弃顶层 const/volatile 和引用。auto& 保留左值引用，auto&& 可以接受任意值类别。花括号初始化可能触发 initializer_list 的特殊推导规则，导致意外的类型选择。",
    "source": "资料依据：cppreference · placeholder type specifiers"
  },
  {
    "id": "006",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "decltype 的推导规则是什么？加括号会改变结果吗？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "对未加括号的名字或成员访问，decltype 直接得到声明类型。对一般表达式，lvalue 得到 T&、xvalue 得到 T&&、prvalue 得到 T。因此额外括号可能把变量名从 T 变成 T&，看似无意义的括号会实质改变推导结果。",
    "source": "资料依据：cppreference · decltype specifier"
  },
  {
    "id": "007",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "enum class 比普通 enum 好在哪里？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "作用域枚举的枚举值必须通过枚举类型名限定访问，不会隐式转换为整数，避免了名字冲突和意外的整型运算。可以显式指定底层类型以控制存储和 ABI，适合需要类型安全的场景。",
    "source": "资料依据：cppreference · enumeration declaration"
  },
  {
    "id": "008",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "静态对象初始化顺序问题是什么？有什么解决办法？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "同一翻译单元内的有序动态初始化按定义顺序进行，但不同翻译单元之间没有可依赖的全局顺序，跨模块的全局对象可能访问尚未初始化的依赖。常用解法是用函数内静态对象按需初始化，C++11 起语言保证这种初始化的线程安全。",
    "source": "资料依据：cppreference · non-local initialization"
  },
  {
    "id": "009",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "什么是整型提升？为什么小整数运算结果可能和预期不同？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "bool、char、short 等小整数类型参与大多数算术运算前会提升为 int 或 unsigned int，运算结果类型由提升后的操作数决定。因此溢出和重载选择不能按原始变量类型判断，char 相乘的结果类型是 int 而非 char。",
    "source": "资料依据：cppreference · implicit conversions integral promotions"
  },
  {
    "id": "010",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "什么是窄化转换？列表初始化为什么能拦住它？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "花括号初始化会拒绝可能丢失范围或精度的整型、浮点转换，这个检查发生在编译期。例如 int x{3.14} 会被拒绝，而 int x(3.14) 可能只留下警告或直接截断。因此列表初始化更适合暴露隐式截断问题。",
    "source": "资料依据：cppreference · list-initialization narrowing conversions"
  },
  {
    "id": "011",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "什么是聚合初始化？C++17 有哪些变化？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "C++17 允许满足聚合条件的类包含公开基类，初始化顺序先基类后成员，未显式提供的成员使用默认成员初始化器或值初始化。用户提供了构造函数等条件会使类型失去聚合资格。聚合初始化的元素个数超过成员数会导致编译错误。",
    "source": "资料依据：cppreference · aggregate initialization"
  },
  {
    "id": "012",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "有符号数和无符号数混用有什么坑？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "通常算术转换可能把有符号操作数转换成同等级的无符号类型，负数随后表现为很大的无符号值，导致比较和循环条件出现意外结果。比较前应统一到能表达双方范围的类型，不能只在结果异常后再做强制转换。",
    "source": "资料依据：cppreference · usual arithmetic conversions"
  },
  {
    "id": "013",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "数组什么时候不会退化成指针？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "数组在大多数值上下文中隐式转换为指向首元素的指针，但作为 sizeof、alignof、取地址和引用绑定的操作数时不会退化。模板按引用接收数组也能保留长度信息，退化是 C++ 中数组相关 bug 的常见来源。",
    "source": "资料依据：cppreference · array-to-pointer conversion"
  },
  {
    "id": "014",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "虚函数是怎么实现的？虚表的结构是什么？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "编译器为每个含虚函数的类生成虚函数表，对象中隐含虚表指针指向所属类的虚表。虚调用通过虚表指针间接寻址到目标函数，实现了运行时多态。多重继承的派生类会包含多个虚表指针，分别对应各基类子对象。",
    "source": "资料依据：cppreference · virtual functions and vtable implementation"
  },
  {
    "id": "015",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "基类析构函数为什么通常要写成 virtual？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "若基类析构函数非虚，通过基类指针 delete 派生对象会产生未定义行为，派生部分不会被正确销毁。虚析构保证从最终派生类开始逐层析构。不允许多态删除的基类可采用 protected 非虚析构来从编译期阻止这种用法。",
    "source": "资料依据：C++ Core Guidelines · virtual destructor for polymorphic base"
  },
  {
    "id": "016",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "纯虚析构函数为什么还要有函数体？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "纯虚析构函数让类保持抽象，但派生对象销毁时仍会调用基类析构部分，链接器需要找到该析构函数的定义。因此即使声明为 = 0 也必须提供实现，这也是为什么抽象基类的析构函数常写成 public virtual 或 protected non-virtual。",
    "source": "资料依据：cppreference · pure virtual destructor"
  },
  {
    "id": "017",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "构造函数和析构函数中调用虚函数有什么问题？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "构造或析构某一层基类期间，虚调用只分派到当前正在构造或析构的层次，不会进入尚未构造或已经销毁的派生部分。依赖完整派生状态的逻辑应放到对象构造完成后的显式阶段，因为此时对象的动态类型被标准限制在当前层。",
    "source": "资料依据：cppreference · virtual function during construction"
  },
  {
    "id": "018",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "什么是对象切片？怎样避免？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "按值构造基类对象只复制派生对象中的基类子对象，派生新增状态被切掉，虚函数分派也不会再看到派生类行为。需要保留动态类型时应使用引用、指针或具备值语义的多态封装。",
    "source": "资料依据：C++ Core Guidelines · object slicing"
  },
  {
    "id": "019",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "什么是三法则、五法则和零法则？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "三法则指出需要自定义析构、复制构造或复制赋值之一时，通常三者都需要自定义。五法则在此基础上加入移动构造和移动赋值。零法则把资源管理交给 RAII 包装和标准容器，使编译器生成的默认操作自然正确。",
    "source": "资料依据：cppreference · rule of zero three five"
  },
  {
    "id": "020",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "什么是 PImpl（实现指针）模式？它解决什么问题？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "PImpl 让公开类只持有指向私有实现的指针，调用方无需看到成员布局，修改实现通常不要求重新编译。析构和移动操作应在实现类型完整的源文件中定义，常见写法是 unique_ptr<Impl> 配合 .cpp 中定义的析构函数。",
    "source": "资料依据：C++ Core Guidelines · pImpl idiom"
  },
  {
    "id": "021",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "什么是 RAII（资源获取即初始化）？它为什么是 C++ 资源管理的核心？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "RAII 把资源获取绑定到构造函数，释放绑定到析构函数，因此正常返回和异常栈展开都会执行同一清理路径。资源拥有者必须具备明确的移动或复制语义，析构应保持不抛异常。它解决了异常路径和提前 return 最容易漏掉清理的问题。",
    "source": "资料依据：cppreference · RAII idiom"
  },
  {
    "id": "022",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "C++ 的异常安全保证分哪几级？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "基本保证：异常后对象仍有效且无资源泄漏，但状态可能改变。强保证：操作要么完全成功要么回滚到调用前状态，通常借助 copy-and-swap 实现。不抛出保证：操作绝不抛异常，析构函数、swap 和移动操作应满足此级别。",
    "source": "资料依据：cppreference · exception safety levels"
  },
  {
    "id": "023",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "noexcept 有什么作用？为什么移动操作应该是 noexcept？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "noexcept 声明函数不会抛出异常，编译器可以据此优化调用路径，且 noexcept 的函数在栈展开时有更好的性能表现。容器在 resize 时优先使用 noexcept 的移动操作，否则退回复制以保证强异常安全，因此移动操作加 noexcept 直接影响容器性能。",
    "source": "资料依据：cppreference · noexcept specifier"
  },
  {
    "id": "024",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "智能指针怎样配合 RAII（资源获取即初始化）管理资源？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "unique_ptr 独占资源所有权，作用域结束时自动释放；shared_ptr 通过引用计数实现共享所有权，最后一个持有者销毁时释放。配合 RAII 可以将裸指针资源包装为异常安全的智能指针，避免手动 delete 的遗漏和重复释放。",
    "source": "资料依据：cppreference · smart pointers and RAII"
  },
  {
    "id": "025",
    "group": "cpp",
    "category": "cpp/lifetime-raii",
    "title": "自定义 deleter 有什么用途？在哪些场景下使用？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "自定义 deleter 允许智能指针在释放时执行非默认的清理逻辑，例如 C 库的 free、fclose 或自定义引用计数释放。unique_ptr 的自定义 deleter 不影响类型大小，shared_ptr 的 deleter 存储在控制块中。这使得 RAII 可以管理任意类型的资源。",
    "source": "资料依据：cppreference · custom deleters for smart pointers"
  },
  {
    "id": "026",
    "group": "cpp",
    "category": "cpp/smart-pointers-allocators",
    "title": "shared_ptr 的引用计数是怎么实现的？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "shared_ptr 使用控制块保存强引用计数和弱引用计数，引用计数的增减是原子操作以保证线程安全。make_shared 将对象和控制块分配在同一块内存中，减少分配次数并改善缓存局部性。当强引用归零时销毁对象，弱引用也归零时释放控制块。",
    "source": "资料依据：cppreference · shared_ptr control block"
  },
  {
    "id": "027",
    "group": "cpp",
    "category": "cpp/smart-pointers-allocators",
    "title": "unique_ptr 和 move 语义怎样配合？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "unique_ptr 禁止复制但支持移动，移动后源指针变为空，所有权被转移到目标。这使得 unique_ptr 可以作为函数返回值安全传递，也能放入容器中使用。移动操作是 noexcept 的，容器会优先利用它来避免不必要的复制。",
    "source": "资料依据：cppreference · unique_ptr and move semantics"
  },
  {
    "id": "028",
    "group": "cpp",
    "category": "cpp/smart-pointers-allocators",
    "title": "weak_ptr 解决什么问题？怎样正确使用？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "weak_ptr 不增加强引用计数，用于打破 shared_ptr 之间的循环引用问题。使用前需要通过 lock 获取 shared_ptr，若对象已销毁则返回空。它适合观察者、缓存或需要检测对象是否存活的场景，但不能直接访问对象成员。",
    "source": "资料依据：cppreference · weak_ptr breaking circular references"
  },
  {
    "id": "029",
    "group": "cpp",
    "category": "cpp/smart-pointers-allocators",
    "title": "make_shared 相比 new 构造 shared_ptr 有什么优势？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "make_shared 把对象和控制块分配在同一块内存中，只需一次内存分配，减少了分配开销并改善缓存局部性。缺点是对象生命周期被控制块绑定，弱引用存活期间对象内存无法释放。对于大对象且不需要长期弱引用时 make_shared 更优。",
    "source": "资料依据：cppreference · make_shared advantages"
  },
  {
    "id": "030",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "vector 的扩容机制是什么？扩容时迭代器会怎样？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "vector 在容量不足时分配更大的内存（通常是 1.5 或 2 倍），将现有元素移动或复制到新内存并释放旧内存。扩容后所有迭代器、指针和引用全部失效。使用 reserve 预分配可以避免频繁扩容，提升性能并避免迭代器意外失效。",
    "source": "资料依据：cppreference · vector capacity and reallocation"
  },
  {
    "id": "031",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "map 和 unordered_map 有什么区别？怎样选择？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "map 基于红黑树实现有序存储，查找 O(log n)，迭代按 key 有序排列。unordered_map 基于哈希表实现，平均 O(1) 查找但最坏 O(n)，迭代顺序不确定。需要有序遍历或对最坏情况敏感时选 map，追求平均性能时选 unordered_map。",
    "source": "资料依据：cppreference · associative containers comparison"
  },
  {
    "id": "032",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "deque 的底层结构是什么？它适合什么场景？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "deque 通常由固定大小的内存块数组组成，两端可以高效地插入和删除，首尾操作均为均摊 O(1)。中间插入仍需移动元素。它作为 std::queue 和 std::stack 的默认底层容器，适合需要两端操作的场景。",
    "source": "资料依据：cppreference · deque internal structure"
  },
  {
    "id": "033",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "set 和 unordered_set 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "set 基于红黑树存储唯一元素并保持有序，查找和插入均为 O(log n)。unordered_set 基于哈希表存储，平均 O(1) 查找但不保持顺序。自定义类型用于 unordered_set 时需提供哈希函数和相等比较。",
    "source": "资料依据：cppreference · set and unordered_set"
  },
  {
    "id": "034",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "priority_queue 的底层实现和适用场景是什么？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "priority_queue 默认基于 vector 用大顶堆实现，top 返回最大元素，push 和 pop 均为 O(log n)。可以通过自定义比较器改变排序方向。它适用于任务调度、Dijkstra 算法和 Top-K 问题等需要快速获取最值的场景。",
    "source": "资料依据：cppreference · priority_queue heap implementation"
  },
  {
    "id": "035",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "STL 迭代器在哪些情况下会失效？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "vector 扩容后所有迭代器失效，删除元素后被删位置之后的迭代器失效。deque 在中间插入删除后所有迭代器失效，两端操作后迭代器失效但引用可能有效。关联容器删除后只有被删元素的迭代器失效。使用时应了解各容器的失效规则，避免悬空迭代器。",
    "source": "资料依据：cppreference · iterator invalidation rules"
  },
  {
    "id": "036",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "什么是 allocator？为什么要自定义分配器？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "allocator 负责容器底层内存的分配、构造和销毁，标准 allocator 封装了 new/delete。自定义分配器可用于池化内存、共享内存映射、NUMA 感知分配或嵌入式系统的静态缓冲区。C++17 起多态分配器进一步简化了运行时切换分配策略的写法。",
    "source": "资料依据：cppreference · allocator and custom allocators"
  },
  {
    "id": "037",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "什么是模板特化和偏特化？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "全特化为特定的模板参数组合提供完整实现，偏特化只对部分参数做特化而保留其他参数为泛型。它们允许为指针、引用或特定类型族提供优化或不同的行为。偏特化只能针对类模板和变量模板，函数模板通过重载实现类似效果。",
    "source": "资料依据：cppreference · template specialization"
  },
  {
    "id": "038",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "什么是 SFINAE（替换失败并非错误）？它的原理是什么？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "SFINAE 指替换失败不是错误：模板参数替换过程中如果产生无效的类型或表达式，该候选会从重载集合中移除而非编译报错。std::enable_if 和 void_t 是利用 SFINAE 的常用工具。C++20 的 concepts 提供了更清晰的约束语法，但 SFINAE 在 C++17 仍是主要的编译期分派手段。",
    "source": "资料依据：cppreference · SFINAE substitution failure"
  },
  {
    "id": "039",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "常用的 type_traits 有哪些？怎么用？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "is_same、is_base_of、is_integral 等提供类型属性查询，enable_if 实现编译期条件，conditional 做编译期分支，decay 和 remove_reference 用于剥离类型修饰。它们是编写泛型代码的基础工具，常与 SFINAE 或 if constexpr 配合使用。",
    "source": "资料依据：cppreference · type traits utilities"
  },
  {
    "id": "040",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "什么是可变参数模板和折叠表达式？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "可变参数模板用 template<typename... Args> 接受任意数量和类型的参数，通过递归或包展开处理参数包。C++17 折叠表达式 (args + ...) 将参数包的二元运算简化为单行表达式，支持一元和二元左折叠、右折叠四种形式。",
    "source": "资料依据：cppreference · variadic templates and fold expressions"
  },
  {
    "id": "041",
    "group": "cpp",
    "category": "cpp/templates-sfinae-traits-constexpr",
    "title": "if constexpr 和普通 if 有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "if constexpr 的条件必须是编译期常量，未选择的分支成为丢弃语句，依赖模板参数的丢弃分支不会在该实例中完成实例化。这避免了为不满足条件的类型生成无效代码，大幅简化了模板中的编译期分支逻辑。",
    "source": "资料依据：cppreference · constexpr if statement"
  },
  {
    "id": "042",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "C++ 的值类别有哪些？左值和右值怎么区分？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "C++ 表达式按身份和可移动性分为 lvalue、xvalue 和 prvalue 三类。lvalue 有确定身份且不可被移动，xvalue 有身份但可被移动，prvalue 没有身份且用于初始化。右值是 xvalue 和 prvalue 的总称，右值引用 && 可以绑定到右值以实现移动语义。",
    "source": "资料依据：cppreference · value categories"
  },
  {
    "id": "043",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "std::move 的作用是什么？它本身会移动对象吗？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "std::move 只做类型转换，把左值转为右值引用以便重载解析选中移动构造或移动赋值，本身不移动任何数据。真正的移动由移动构造函数或移动赋值运算符完成。对 const 对象使用 std::move 通常会退回复制，因为 const 右值引用无法绑定到非 const 移动操作。",
    "source": "资料依据：cppreference · std::move utility"
  },
  {
    "id": "044",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "std::forward 和完美转发是怎么回事？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "std::forward 在模板中保持实参的值类别不变，让转发函数将参数以原始的左值或右值形式传递给下一层。它配合万能引用 T&& 使用，避免所有参数都被当作左值处理。完美转发确保包装函数不会改变调用语义。",
    "source": "资料依据：cppreference · std::forward perfect forwarding"
  },
  {
    "id": "045",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "什么是 RVO 和拷贝消除？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "返回值优化让编译器直接在调用者的存储空间中构造返回对象，避免额外的复制或移动。C++17 将强制拷贝消除写入语言标准，prvalue 不再产生临时对象而是直接初始化目标。这保证了即使类型不可复制也能作为函数返回值使用。",
    "source": "资料依据：cppreference · copy elision and RVO"
  },
  {
    "id": "046",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "移动语义在 STL 容器中是怎样应用的？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "容器在扩容或重新分配时使用移动而非复制，前提是该类型的移动操作是 noexcept 的。emplace_back 在容器内存中原位构造对象，避免临时对象的创建和移动。使用 std::move 将元素移入容器可以显著减少不必要的深拷贝。",
    "source": "资料依据：cppreference · move semantics in containers"
  },
  {
    "id": "047",
    "group": "cpp",
    "category": "cpp/lambdas-utility-types",
    "title": "Lambda 表达式的捕获方式有哪些？各有什么注意事项？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "值捕获 [=] 复制变量到闭包，引用捕获 [&] 保存引用但可能导致悬空引用。C++14 支持广义捕获，可以用移动语义捕获 unique_ptr 等资源。lambda 作为回调时应明确选择捕获方式并确保被捕获对象在 lambda 生命周期内有效。",
    "source": "资料依据：cppreference · lambda expression capture"
  },
  {
    "id": "048",
    "group": "cpp",
    "category": "cpp/lambdas-utility-types",
    "title": "std::function 和直接使用 lambda 有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "std::function 是类型擦除包装器，可以存储任意可调用对象，适合作为接口参数。但它有堆分配和间接调用开销，频繁调用时不如模板参数或具体 lambda 类型高效。内部使用的小闭包可以利用小对象优化避免动态分配。",
    "source": "资料依据：cppreference · std::function type erasure"
  },
  {
    "id": "049",
    "group": "cpp",
    "category": "cpp/lambdas-utility-types",
    "title": "std::optional、std::variant 和 std::any 各解决什么问题？",
    "difficulty": 3,
    "scopes": [
      "C++17"
    ],
    "answer": "optional 表示可能不存在的值，避免用特殊值或指针表达空状态。variant 是类型安全的联合体，同一时刻持有多种候选类型之一。any 可以存储任意类型，取值时需要 any_cast 并处理类型不匹配。三者都避免了裸指针和动态分配的开销。",
    "source": "资料依据：cppreference · optional variant any vocabulary types"
  },
  {
    "id": "050",
    "group": "cpp",
    "category": "cpp/lambdas-utility-types",
    "title": "std::tuple 和结构化绑定怎么用？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "tuple 可以打包不同类型的值，std::get 或 std::tie 用于访问元素。C++17 结构化绑定 auto [a, b] = pair 让返回值解包更简洁，适用于多返回值函数和 map 遍历。tuple 也是实现泛型编程中复合返回值的基础工具。",
    "source": "资料依据：cppreference · tuple and structured bindings"
  },
  {
    "id": "051",
    "group": "cpp",
    "category": "cpp/exceptions-rtti",
    "title": "C++ 异常处理的抛出和捕获机制是怎样的？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "throw 表达式构造异常对象并沿调用栈向上传播，直到匹配的 catch 块捕获。catch 按类型匹配且按声明顺序选择第一个匹配项，catch(...) 捕获所有异常。未捕获的异常会调用 std::terminate 终止程序。异常对象在传播过程中会被复制或移动。",
    "source": "资料依据：cppreference · exception handling mechanism"
  },
  {
    "id": "052",
    "group": "cpp",
    "category": "cpp/exceptions-rtti",
    "title": "RTTI 和 typeid 有什么用途和开销？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "RTTI 通过 typeid 运算符获取对象的运行时类型信息，返回 std::type_info 引用。它需要虚表支持，因此只对含虚函数的多态类型有效。RTTI 有存储和查询开销，某些嵌入式或性能敏感环境会禁用它，改用自定义类型标识方案。",
    "source": "资料依据：cppreference · RTTI and typeid"
  },
  {
    "id": "053",
    "group": "cpp",
    "category": "cpp/exceptions-rtti",
    "title": "dynamic_cast 的实现原理和使用场景是什么？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "dynamic_cast 借助 RTTI 在运行时检查继承关系，向下转换成功返回目标指针，失败返回 nullptr（指针）或抛 bad_cast（引用）。它需要基类有虚函数，对性能敏感代码可能不够友好。频繁的 dynamic_cast 通常暗示类型层次设计需要调整。",
    "source": "资料依据：cppreference · dynamic_cast implementation"
  },
  {
    "id": "054",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "std::thread 的基本用法和注意事项有哪些？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "std::thread 构造时启动新线程，必须在析构前调用 join 或 detach，否则程序终止。join 等待线程完成，detach 让线程在后台运行但失去控制能力。传递参数默认按值复制，需要引用传递时应使用 std::ref 包装。",
    "source": "资料依据：cppreference · std::thread basics"
  },
  {
    "id": "055",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "mutex、lock_guard 和 unique_lock 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "mutex 提供基本的互斥锁操作，lock_guard 在构造时加锁、析构时解锁，实现 RAII 风格的自动管理。unique_lock 更灵活，支持延迟锁定、手动解锁和条件变量配合使用。lock_guard 更轻量适合简单场景，unique_lock 适合需要精细控制锁状态的场合。",
    "source": "资料依据：cppreference · mutex lock_guard unique_lock"
  },
  {
    "id": "056",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "condition_variable 怎样避免虚假唤醒？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "condition_variable 的 wait 可能在没有 notify 的情况下返回，这就是虚假唤醒。正确做法是在循环中调用 wait 并重新检查条件谓词，或使用带谓词的 wait 重载让它自动循环。条件变量必须配合 mutex 使用，wait 返回时 mutex 已被重新获取。",
    "source": "资料依据：cppreference · condition_variable spurious wakeup"
  },
  {
    "id": "057",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "std::atomic 和内存序是什么？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "atomic 提供原子读写和 CAS 操作，保证并发访问不会发生数据竞争。内存序控制操作的可见性顺序，默认的 memory_order_seq_cst 提供最强的一致性但性能较低，relaxed 只保证原子性不提供排序，acquire/release 在两者之间取得平衡。",
    "source": "资料依据：cppreference · atomic operations and memory order"
  },
  {
    "id": "058",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "std::async、std::future 和 std::promise 怎样配合使用？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "async 异步启动任务并返回 future，future 用于获取异步结果或等待完成。promise 允许手动设置结果或异常，适合将结果从一个线程传递到另一个线程。async 的启动策略可选立即执行或延迟执行，不保存 future 时 async 会同步等待完成。",
    "source": "资料依据：cppreference · async future promise"
  },
  {
    "id": "059",
    "group": "cpp",
    "category": "cpp/strings-time-files-streams",
    "title": "std::string 的小字符串优化（SSO）是什么？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "多数 std::string 实现在对象内部预留一段小缓冲区，当字符串长度不超过该缓冲区时直接在栈上存储而无需堆分配，这就是小字符串优化。它显著减少了短字符串的分配开销，典型阈值在 15 到 22 字节之间，具体取决于实现和对齐。",
    "source": "资料依据：cppreference · basic_string small string optimization"
  },
  {
    "id": "060",
    "group": "cpp",
    "category": "cpp/strings-time-files-streams",
    "title": "C++ 文件流和 iostream 的基本用法是什么？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "ifstream、ofstream 和 fstream 分别用于文件读取、写入和读写，构造时打开文件，析构时自动关闭。配合 RAII 可以安全地管理文件句柄。iostream 体系通过格式化运算符和 manipulator 提供类型安全的输入输出，但性能通常不如 C 风格的 stdio。",
    "source": "资料依据：cppreference · file stream and iostream basics"
  },
  {
    "id": "061",
    "group": "gof",
    "category": "gof/creation",
    "title": "什么是单例模式？C++ 中如何保证线程安全的单例？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "单例模式确保一个类只有一个实例并提供全局访问点。C++11 起函数内静态局部变量在首次控制流经过时初始化，语言保证并发初始化只执行一次，比手写双重检查锁定更可靠。单例会引入全局可变状态和隐藏依赖，测试替换与静态析构顺序是采用前必须接受的代价。",
    "pattern": "Singleton",
    "source": "资料依据：GoF · GoF Singleton sole instance and global access"
  },
  {
    "id": "062",
    "group": "gof",
    "category": "gof/creation",
    "title": "什么是工厂方法模式？它把创建逻辑延迟到哪里？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "工厂方法在基类中定义创建对象的接口，由派生类覆盖该方法来选择具体产品类型，业务流程仍写在基类中。它适合产品类型由子类或配置变化决定的框架，新增产品通常需要新增创建者而非修改已有调用流程。",
    "pattern": "Factory Method",
    "source": "资料依据：GoF · GoF Factory Method product creation hook"
  },
  {
    "id": "063",
    "group": "gof",
    "category": "gof/creation",
    "title": "什么是抽象工厂模式？它解决了什么问题？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "抽象工厂定义创建一组相关或相互依赖产品的接口，客户端只依赖抽象工厂即可获得配套的产品族，无需关心具体实现。它适合产品族需要整体替换的场景，例如跨平台 UI 组件。缺点是新增产品种类会迫使所有工厂实现一起扩展。",
    "pattern": "Abstract Factory",
    "source": "资料依据：GoF · GoF Abstract Factory intent and product-family consistency"
  },
  {
    "id": "064",
    "group": "gof",
    "category": "gof/creation",
    "title": "什么是建造者模式？适用于什么场景？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "建造者模式将复杂对象的构建步骤与最终表示分离，使同样的构建过程可以产生不同的表示。当产品有许多可选部件或构建步骤有严格顺序时适用，简单对象使用构造函数或工厂更直接。核心好处是把构造顺序、校验和最终表示分开管理。",
    "pattern": "Builder",
    "source": "资料依据：GoF · GoF Builder construction process and representation"
  },
  {
    "id": "065",
    "group": "gof",
    "category": "gof/creation",
    "title": "什么是原型模式？C++ 中如何处理深拷贝和浅拷贝？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "原型模式通过复制已配置实例来创建新对象，绕过具体构造过程。C++ 中多态复制通常要求虚拟 clone 方法返回拥有型指针，并为每个资源定义复制失败时的清理路径。深拷贝与浅拷贝的边界由对象语义决定，共享不可变资源可以节省开销，独立资源必须完整复制。",
    "pattern": "Prototype",
    "source": "资料依据：GoF · GoF Prototype cloning and copy semantics"
  },
  {
    "id": "066",
    "group": "gof",
    "category": "gof/structural",
    "title": "什么是适配器模式？对象适配器和类适配器有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "适配器将一个类的接口转换为客户端期望的另一个接口，使原本不兼容的类可以协作。对象适配器通过组合持有被适配对象，不受单继承限制且运行时可替换。类适配器依赖多重继承，能直接覆盖受保护行为。C++ 中优先使用组合方式。",
    "pattern": "Adapter",
    "source": "资料依据：GoF · GoF Adapter object and class adapters"
  },
  {
    "id": "067",
    "group": "gof",
    "category": "gof/structural",
    "title": "什么是桥接模式？它的设计意图是什么？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "桥接模式将抽象部分与实现部分分离，使两者可以独立变化。它把操作接口与底层细节放在两个独立继承层次中，由抽象端持有实现接口。两条变化轴可独立扩展，代价是多一个间接层。若只有一个稳定实现，普通继承更简单。",
    "pattern": "Bridge",
    "source": "资料依据：GoF · GoF Bridge abstraction-implementation separation"
  },
  {
    "id": "068",
    "group": "gof",
    "category": "gof/structural",
    "title": "什么是组合模式？如何统一叶子节点和容器节点的操作？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "组合模式把叶子对象和容器对象放进同一组件接口，客户端可以对单个对象和整棵树使用相同操作。透明版本让叶子也暴露 add/remove 便于递归处理但不够类型安全，安全版本则需要在易用性与编译期检查之间取舍。",
    "pattern": "Composite",
    "source": "资料依据：GoF · GoF Composite part-whole hierarchy"
  },
  {
    "id": "069",
    "group": "gof",
    "category": "gof/structural",
    "title": "什么是装饰器模式？它和继承相比有什么优势？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "装饰器实现与被装饰对象相同的接口，在转发调用前后附加额外职责，从而在运行时动态叠加功能。相比继承，它避免了子类爆炸并支持灵活组合。代价是调用链变长且调试困难，装饰器顺序可能影响最终行为。",
    "pattern": "Decorator",
    "source": "资料依据：GoF · GoF Decorator dynamic responsibility attachment"
  },
  {
    "id": "070",
    "group": "gof",
    "category": "gof/structural",
    "title": "什么是外观模式？它如何降低系统复杂度？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "外观为一组子系统提供统一的高层接口，隐藏子系统间的初始化顺序和协作细节，降低调用方的耦合度。但它不替子系统定义新的业务模型，外观本身也可能膨胀成上帝对象。复杂场景应拆成多个外观或保留受控的子系统直接访问。",
    "pattern": "Facade",
    "source": "资料依据：GoF · GoF Facade subsystem interface"
  },
  {
    "id": "071",
    "group": "gof",
    "category": "gof/structural",
    "title": "什么是享元模式？内在状态和外在状态如何划分？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "享元把可共享的内在状态放入池中，将位置、颜色等每次使用才确定的外在状态交给调用者传入。共享前必须证明内在状态不可变或有同步保护，否则会节省内存却换来跨对象状态污染。它适合存在大量相似对象的场景。",
    "pattern": "Flyweight",
    "source": "资料依据：GoF · GoF Flyweight intrinsic and extrinsic state"
  },
  {
    "id": "072",
    "group": "gof",
    "category": "gof/structural",
    "title": "什么是代理模式？常见的代理类型有哪些？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "代理实现与真实对象相同的接口，在转发前后加入权限检查、缓存、日志或远程传输等控制逻辑。常见类型包括虚拟代理、保护代理和远程代理。代理不应伪装同步本地对象来掩盖网络延迟和失败，远程代理尤其需要明确超时和资源所有权。",
    "pattern": "Proxy",
    "source": "资料依据：GoF · GoF Proxy subject access control"
  },
  {
    "id": "073",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "什么是责任链模式？它的优缺点是什么？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "责任链把请求沿一组处理者传递，每个处理者决定处理或交给后继者，发送者不依赖具体接收者。它适合运行时灵活组合处理步骤，但请求可能无人处理且对顺序敏感。应定义终止处理者和可观察的拒绝结果，避免请求静默丢失。",
    "pattern": "Chain of Responsibility",
    "source": "资料依据：GoF · GoF Chain of Responsibility successor handling"
  },
  {
    "id": "074",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "什么是命令模式？如何实现撤销操作？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "命令模式将一次操作封装成对象，包含接收者、参数和执行入口，使请求可以排队、记录或延迟执行。撤销需要保存执行前足以恢复不变量的状态，或设计可逆的反向操作。异步队列还需定义取消、失败和重试语义。",
    "pattern": "Command",
    "source": "资料依据：GoF · GoF Command request encapsulation and undo"
  },
  {
    "id": "075",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "什么是解释器模式？适用于什么场景？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "解释器把语言的文法规则表示为表达式对象层次，非终结符组合子表达式，终结符读取输入。它适合小而稳定的 DSL，文法规则直接对应类层次。当文法规模或性能要求上升后，解析器生成器和专用 AST 通常更可维护。",
    "pattern": "Interpreter",
    "source": "资料依据：GoF · GoF Interpreter grammar representation"
  },
  {
    "id": "076",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "什么是迭代器模式？C++ 中如何自定义迭代器？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "迭代器把遍历位置和递增规则封装在对象中，集合只需暴露 begin/end 接口，客户端无需知道底层存储结构。C++ 自定义迭代器需要明确定义比较、终止和失效规则，容器修改后继续使用旧迭代器属于未定义行为。",
    "pattern": "Iterator",
    "source": "资料依据：GoF · GoF Iterator aggregate traversal"
  },
  {
    "id": "077",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "什么是中介者模式？它如何解耦对象之间的交互？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "中介者引入一个协调对象，让各同事只依赖中介者接口而不彼此直接调用，把网状依赖变成星形依赖。它适合协作规则集中且变化频繁的场景。当中介者承载过多业务时会成为上帝对象，应按用例拆分或引入领域服务。",
    "pattern": "Mediator",
    "source": "资料依据：GoF · GoF Mediator colleague collaboration"
  },
  {
    "id": "078",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "什么是备忘录模式？如何在不破坏封装的前提下保存状态？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "备忘录由发起者创建状态快照，管理者只持有不透明句柄而不读取内容，从而在不暴露内部表示的前提下保存和恢复状态。快照需要定义一致性时点和容量成本，含外部资源句柄时恢复不一定能重建资源。",
    "pattern": "Memento",
    "source": "资料依据：GoF · GoF Memento encapsulation boundary"
  },
  {
    "id": "079",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "什么是观察者模式？如何处理订阅和取消订阅的生命周期？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "观察者定义一对多依赖，目标状态变化时自动通知所有已注册的观察者。订阅关系应有明确的取消机制，弱引用或订阅令牌可避免被通知对象销毁后仍触发回调。通知期间增删绑定应延迟到本轮广播结束，防止迭代器失效或跳过观察者。",
    "pattern": "Observer",
    "source": "资料依据：GoF · GoF Observer subject notification"
  },
  {
    "id": "080",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "什么是状态模式？它和策略模式有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "状态模式把每个状态相关的行为封装在独立对象中，由上下文委托当前状态对象处理事件并在需要时切换。它能替代大型条件分支，但状态切换、共享数据和转移合法性需要额外契约。状态模式针对状态变化，策略模式针对算法替换，两者的变化维度不同。",
    "pattern": "State",
    "source": "资料依据：GoF · GoF State state-dependent behavior"
  },
  {
    "id": "081",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "什么是策略模式？如何封装可互换的算法？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "策略模式把一组可互换算法封装成共同接口，由上下文持有并委托当前策略，将选择与实现分离。它适合运行时或配置驱动的算法切换。策略类过多会增加装配和间接调用成本，固定且简单的分支用条件语句更直接。",
    "pattern": "Strategy",
    "source": "资料依据：GoF · GoF Strategy interchangeable algorithm"
  },
  {
    "id": "082",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "什么是模板方法模式？钩子函数的作用是什么？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "模板方法在基类中定义算法骨架，通过受保护的钩子或原语操作把可变步骤交给子类实现。调用者只看到稳定的公共流程，子类只覆盖确有变化的步骤。代价是基类控制反转且子类组合受限，需要防止钩子破坏骨架不变量。钩子通常提供无操作或保守的默认实现。",
    "pattern": "Template Method",
    "source": "资料依据：GoF · GoF Template Method algorithm skeleton and hooks"
  },
  {
    "id": "083",
    "group": "gof",
    "category": "gof/behavioral",
    "title": "什么是访问者模式？双重分派解决了什么问题？",
    "difficulty": 4,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "访问者把操作放进独立对象，元素通过 accept 将自身类型分派给对应的 visit 方法，新增操作无需修改元素类。双重分派先选元素动态类型，再由 accept 内部选具体访问者重载，绕过单次虚调用的类型限制。它适合元素层次稳定而操作经常增加的系统，新增元素则要求修改所有访问者。",
    "pattern": "Visitor",
    "source": "资料依据：GoF · GoF Visitor double dispatch and operation extension"
  },
  {
    "id": "084",
    "group": "gof",
    "category": "gof/creation",
    "title": "工厂方法和抽象工厂有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "工厂方法通过子类决定创建哪种产品，把创建逻辑延迟到派生类，扩展方向是增加产品种类。抽象工厂定义创建一组相关产品的接口，保证产品族配套使用，扩展方向是增加产品族。两者都依赖抽象产品接口，但抽象工厂更关注产品间的约束关系。",
    "pattern": "Cross-pattern",
    "source": "资料依据：GoF · GoF pattern relationships and creation tradeoffs"
  },
  {
    "id": "085",
    "group": "gof",
    "category": "gof/creation",
    "title": "建造者模式和命名构造函数如何选择？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "命名构造函数适合少量互斥选项，能保持调用点简洁并直接返回完整对象。建造者更适合许多可选步骤、需要校验或多种表示的场景。建造者会增加类型数量和状态管理成本，如果构建过程并不复杂，采用它反而扩大了维护面。",
    "pattern": "Cross-pattern",
    "source": "资料依据：GoF · GoF Builder construction process and representation"
  },
  {
    "id": "086",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UE5 的反射系统是怎么工作的？UHT 在其中扮演什么角色？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "UHT 在构建阶段读取 UCLASS、USTRUCT、UFUNCTION、UPROPERTY 等反射宏，生成注册代码和 generated.h 头文件。运行时由 UClass、FProperty、UFunction 等对象保存反射信息，引擎据此实现序列化、蓝图调用和编辑器功能。业务代码应使用 StaticClass、GetClass 等 API 查询，不要直接依赖 Intermediate 目录的生成文件。",
    "source": "资料依据：Epic Games · Unreal Header Tool and Reflection System"
  },
  {
    "id": "087",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UCLASS 和 USTRUCT 有什么区别？什么时候用哪个？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "UCLASS 类型由 UHT 注册，实例必须通过 UObject 创建路径产生，具备对象身份、GC 生命周期和反射引用。USTRUCT 是按值构造和复制的数据类型，只有被反射标记的字段才自动参与序列化和编辑器工具。长寿命、需要多态和 GC 引用的对象用 UCLASS，小型数据和值语义传递用 USTRUCT。",
    "source": "资料依据：Epic Games · UObjects versus UStructs"
  },
  {
    "id": "088",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UHT 常见的解析失败原因有哪些？如何定位生成错误？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "常见原因包括缺少或位置错误的 generated.h、反射宏藏在复杂宏内部、不支持的模板签名和括号不匹配。定位时应读取构建日志中最早的 UHT 错误和对应源文件行号，生成目录只用于核对，不能手工修补。移动代码后的异常应通过清理 Intermediate 产物并重新运行 UHT 解决。",
    "source": "资料依据：Epic Games · UHT Parsing and Generated Headers"
  },
  {
    "id": "089",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UE5 的 GC 机制是什么？哪些引用能被 GC 识别？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "UE5 的 GC 基于可达性分析，从根集合出发沿 UPROPERTY、TObjectPtr、反射容器和 AddReferencedObjects 遍历可达对象。未反射的裸指针和普通 C++ 容器不会自动进入 GC 引用图，必须改用受跟踪引用或显式引用收集。未被任何根可达的 UObject 会在下次 GC 时被回收。",
    "source": "资料依据：Epic Games · Garbage Collection and Reflected References"
  },
  {
    "id": "090",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UPROPERTY 的 EditAnywhere、VisibleOnly 等 specifier 分别控制什么？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "EditAnywhere 允许在类默认值和实例上修改属性，EditDefaultsOnly 和 EditInstanceOnly 分别限制到其中之一，Visible 系列只改变详情面板的可读性。BlueprintReadOnly、Config、Replicated 等规则另行决定脚本访问、配置保存或网络同步，不能由 Edit/Visible specifier 推导其他能力。",
    "source": "资料依据：Epic Games · Property Specifiers and Editor Visibility"
  },
  {
    "id": "091",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UFUNCTION 的 BlueprintCallable、BlueprintPure 和 BlueprintNativeEvent 有什么区别？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "BlueprintCallable 让函数可以在蓝图中被调用，BlueprintPure 标记为无副作用的纯函数，蓝图节点不显示执行引脚。BlueprintNativeEvent 生成可从蓝图覆盖的入口，C++ 默认行为写在 _Implementation 后缀函数中。调用时应使用无前缀的函数名以经过蓝图分派，直接调用 _Implementation 会绕过蓝图覆盖。",
    "source": "资料依据：Epic Games · UFunction Specifiers and Blueprint Events"
  },
  {
    "id": "092",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "TObjectPtr 和裸 UObject 指针在 GC 和序列化方面有什么差异？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "TObjectPtr 是 UE5 推荐的 UObject 成员指针表示，配合 UPROPERTY 时可参与 GC、序列化和编辑器中的引用跟踪与重定向。裸 UObject 指针若同样标记为 UPROPERTY 仍可被反射系统跟踪。但无论哪种表示，未反射的指针都不能单独充当 GC 根，对象可能被意外回收。",
    "source": "资料依据：Epic Games · Object Pointers and TObjectPtr"
  },
  {
    "id": "093",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "TWeakObjectPtr 怎么用？IsValid 和裸指针的 Pin 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "TWeakObjectPtr 通过对象索引和序列号观察 UObject，不增加强引用，对象被回收后 IsValid 返回 false。Pin 是 TWeakPtr（非 UObject 弱指针）的接口，TWeakObjectPtr 应使用 Get 或 IsValid。在游戏线程取得结果后应立即校验，不要在帧间缓存弱引用结果。",
    "source": "资料依据：Epic Games · Weak Object Pointers"
  },
  {
    "id": "094",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "NewObject、DuplicateObject 和 CreateDefaultSubobject 分别在什么时候用？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "NewObject 用于运行时创建全新 UObject，DuplicateObject 复制已有对象及其可复制属性，CreateDefaultSubobject 只应在类构造函数中建立默认子对象模板。动态 ActorComponent 通常用 NewObject 创建，再按需要加入实例组件列表并注册。混淆三者的使用时机会导致编辑器默认结构异常或运行时组件缺失。",
    "source": "资料依据：Epic Games · Creating and Duplicating UObject Instances"
  },
  {
    "id": "095",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "RF_Transient、RF_Public 等对象标志分别影响什么行为？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "RF_Transient 阻止对象进入常规包保存，RF_Public 允许对象作为包的公开导出被外部引用，RF_ClassDefaultObject 和 RF_ArchetypeObject 描述默认对象和原型角色。大多数标志不是 GC 强引用，判断存活性仍要看可达关系。调试生命周期时应结合 IsValid 和 BeginDestroy/FinishDestroy 日志。",
    "source": "资料依据：Epic Games · EObjectFlags and UObject Lifecycle"
  },
  {
    "id": "096",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "GENERATED_BODY 的位置和声明顺序有什么要求？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "GENERATED_BODY 必须位于对应 UCLASS、USTRUCT 或 UINTERFACE 声明体内且只出现一次，并与头文件中最后包含的 generated.h 配对。它展开的声明与文件和行号关联，移动代码后应重新运行 UHT 或清理 Intermediate 产物。缺少 GENERATED_BODY 会导致编译错误和反射信息缺失。",
    "source": "资料依据：Epic Games · GENERATED_BODY and Generated Code"
  },
  {
    "id": "097",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "Actor 的生命周期是怎样的？构造函数、OnConstruction、BeginPlay 分别做什么？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "C++ 构造函数为 CDO 和每个实例执行，只适合设置默认值和创建默认子对象，此时不能假定已有有效 World。OnConstruction 在属性初始化后执行并可被编辑器多次调用，BeginPlay 在组件注册完成后触发，适合一次性运行时初始化。混淆三者的时机是 Actor 相关 bug 的常见来源。",
    "source": "资料依据：Epic Games · Actor Lifecycle: Construction and BeginPlay"
  },
  {
    "id": "098",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "OnConstruction 在运行时 SpawnActor 和编辑器放置 Actor 时有什么区别？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "编辑器放置 Actor 的 OnConstruction 会随属性编辑和重建多次运行，并携带关卡实例的覆盖值。SpawnActor 路径则使用 Spawn 参数和 ExposeOnSpawn 值，延迟生成还要等 FinishSpawning 才执行完整构造。因此 OnConstruction 中的逻辑必须可重复且不依赖固定调用次数。",
    "source": "资料依据：Epic Games · Construction Script for Placed and Spawned Actors"
  },
  {
    "id": "099",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "Actor 和 Component 有什么区别？为什么 UE5 推崇组件化设计？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "Actor 是 World 中可生成的顶层实体，具备生命周期和网络复制能力。Component 是附加在 Actor 上的功能模块，负责具体行为如渲染、物理和输入。组件化设计让功能可以灵活组合和复用，避免 Actor 继承层次过深，也便于编辑器中可视化配置。",
    "source": "资料依据：Epic Games · Actors and Components Architecture"
  },
  {
    "id": "100",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "运行时创建组件后需要哪些步骤才能正常工作？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "运行时组件应以目标 Actor 为 Outer 创建，需要保存为实例组件时调用 AddInstanceComponent，设置附加关系后调用 RegisterComponent。未注册的组件没有渲染、物理或 Tick 状态。激活和 Tick 开关应在所有依赖和初始属性就绪后设置，而不是注册前就打开。",
    "source": "资料依据：Epic Games · Runtime Component Creation and Registration"
  },
  {
    "id": "101",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "UE5 的 Subsystem 有哪几种？它们的范围和生命周期有什么区别？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "UEngineSubsystem 与引擎同寿命，UGameInstanceSubsystem 与 GameInstance 同寿命可跨关卡存在，UWorldSubsystem 为每个 UWorld 创建独立实例，ULocalPlayerSubsystem 绑定到本地玩家。选择时应根据状态的归属范围决定，跨关卡的会话状态用 GameInstance，世界级的缓存用 World。",
    "source": "资料依据：Epic Games · Programming Subsystems"
  },
  {
    "id": "102",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "Tick 和 TickGroup 是什么？如何控制组件的更新顺序？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "TickFunction 每帧被引擎调度执行，PrimaryComponentTick 在构造阶段通过 bCanEverTick、TickGroup 和 TickInterval 配置。AddTickPrerequisiteComponent 可建立细粒度的前置依赖关系，TickGroup 提供更粗的阶段顺序。依赖图应无环，不能依赖组件数组或注册的偶然顺序。",
    "source": "资料依据：Epic Games · Actor Ticking and Tick Prerequisites"
  },
  {
    "id": "103",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "RootComponent 和组件附加关系如何正确设置？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "RootComponent 必须是 Actor 拥有的 USceneComponent，子组件应通过 SetupAttachment 或 AttachToComponent 建立层级。附加时需明确 KeepRelative、KeepWorld 或 SnapToTarget 等变换规则。在构造函数中使用 SetupAttachment，运行时使用 AttachToComponent 并指定变换保持模式。",
    "source": "资料依据：Epic Games · Scene Component Attachment"
  },
  {
    "id": "104",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "EndPlay、OnDestroyed 和析构函数各自负责什么清理工作？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "EndPlay 覆盖销毁、关卡切换、停止 PIE 等多种离场原因，适合停止 Timer、异步任务和委托。OnDestroyed 更偏向 Actor 被 Destroy 的通知，C++ 析构发生得更晚且此时 World 可能已不可用。主要玩法清理应放在 EndPlay 中，析构函数不应承担依赖 World 的清理逻辑。",
    "source": "资料依据：Epic Games · Actor EndPlay and Destruction"
  },
  {
    "id": "105",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "SpawnActor 的参数有哪些？Owner 和 Instigator 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "FActorSpawnParameters 包含 Owner、Instigator、SpawnCollisionHandlingOverride 和 Template 等配置。Owner 影响网络所有权和 RPC 路由，Instigator 用于伤害或行为归因。SpawnCollisionHandlingOverride 控制碰撞冲突时的处理方式，生成后必须检查返回值是否为空。",
    "source": "资料依据：Epic Games · Spawning Actors and SpawnParameters"
  },
  {
    "id": "106",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "PostInitializeComponents 在什么时候调用？适合做什么？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "PostInitializeComponents 在所有组件注册完成后、BeginPlay 之前调用，此时 Actor 的完整组件树已经可用。它适合需要引用其他组件进行初始化的逻辑，例如绑定委托或读取相邻组件的属性。编辑器和运行时都会执行这个回调。",
    "source": "资料依据：Epic Games · Actor PostInitializeComponents"
  },
  {
    "id": "107",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "单播委托和多播委托有什么区别？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "单播委托只保存一个绑定目标，执行有返回值的委托前需检查 IsBound，用 Execute 获取结果。多播委托向多个绑定广播，不提供聚合返回值，使用 Broadcast 触发所有绑定。Epic 的契约不保证多播委托的调用顺序，广播期间增删绑定应将变更延迟到本轮结束。",
    "source": "资料依据：Epic Games · Delegates: Single-Cast and Multicast"
  },
  {
    "id": "108",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "动态委托和静态委托有什么区别？什么时候用哪个？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "动态委托通过反射和 UFUNCTION 名称绑定，可以被蓝图使用并支持序列化，但签名类型受限且调用成本更高。静态委托性能更好且类型检查更严格，适合纯 C++ 高频回调。需要资产保存或蓝图绑定时选动态委托，否则优先使用静态委托。",
    "source": "资料依据：Epic Games · Dynamic versus Static Delegates"
  },
  {
    "id": "109",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "AddUObject、AddRaw 和 AddLambda 的生命周期风险分别是什么？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "AddUObject 记录 UObject 弱绑定，对象失效后自动跳过调用。AddRaw 不跟踪普通 C++ 对象寿命，目标析构前必须显式移除绑定。AddLambda 的捕获寿命完全由调用方管理，涉及 UObject 时可用 AddWeakLambda 或捕获弱引用后校验。混淆这些绑定方式是委托崩溃的常见原因。",
    "source": "资料依据：Epic Games · Delegate Binding and Lifetime"
  },
  {
    "id": "110",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "BlueprintNativeEvent 的 C++ 实现规则是什么？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "BlueprintNativeEvent 会生成可从蓝图覆盖的入口，C++ 默认行为写在 FunctionName_Implementation 中。业务代码应调用 FunctionName 以经过蓝图分派，派生 C++ 类覆盖 _Implementation。直接调用 _Implementation 会绕过蓝图覆盖和生成的事件入口，导致蓝图逻辑不生效。",
    "source": "资料依据：Epic Games · BlueprintNativeEvent Implementation"
  },
  {
    "id": "111",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "UINTERFACE 和纯 C++ 虚接口有什么区别？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "UINTERFACE 声明反射可见的 U 类，配套的 I 接口承载 C++ 函数契约，实现 UObject 类同时继承 I 接口并在 UCLASS 中声明 ImplementsInterface。纯 C++ 接口可直接虚调用，但要支持蓝图实现时必须使用反射检查和生成的 Execute_ 函数。",
    "source": "资料依据：Epic Games · Unreal Interfaces"
  },
  {
    "id": "112",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "对象销毁或 EndPlay 时应该如何清理委托绑定？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "绑定长寿命发布者时应保存 FDelegateHandle，在 EndPlay、Deinitialize 或 C++ 对象析构前调用 Remove 或 RemoveAll。AddUObject 能阻止无效 UObject 被执行，但仍应清理无用条目。Raw 和 Lambda 绑定更不能依赖发布者猜测目标寿命，必须主动移除。",
    "source": "资料依据：Epic Games · Removing Delegate Bindings"
  },
  {
    "id": "113",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "BlueprintImplementableEvent 和 BlueprintNativeEvent 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "BlueprintImplementableEvent 只能在蓝图中实现，C++ 侧不能提供默认实现，调用时如果蓝图未实现则不执行任何操作。BlueprintNativeEvent 可以在 C++ 中提供 _Implementation 默认实现，蓝图可以覆盖它。需要 C++ 默认行为时选 NativeEvent，纯蓝图扩展点选 ImplementableEvent。",
    "source": "资料依据：Epic Games · Blueprint Event Specifiers"
  },
  {
    "id": "114",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "Lambda 捕获 UObject 时有什么安全注意事项？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "普通 AddLambda 不跟踪 UObject 生命周期，如果 UObject 被 GC 回收而 Lambda 仍被调用会导致悬空指针。应使用 AddWeakLambda 或手动捕获 TWeakObjectPtr 并在回调中调用 IsValid 校验。异步任务切回游戏线程后必须同时校验对象和 World 有效性。",
    "source": "资料依据：Epic Games · Lambda Capture and UObject Lifetime"
  },
  {
    "id": "115",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "UE5 的网络复制原理是什么？Actor 如何实现属性同步？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "UE5 使用服务器权威模型，服务器决定 Actor 的最终状态并通过属性复制同步到客户端。Actor 需要设置 bReplicates 为 true，需要同步的属性用 UPROPERTY(Replicated) 标记。服务器按优先级和带宽限制定期发送属性更新，客户端收到后应用 RepNotify 回调或自定义同步逻辑。",
    "source": "资料依据：Epic Games · Actor Replication Overview"
  },
  {
    "id": "116",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "RPC 的三种类型 Server、Client 和 NetMulticast 分别在什么场景使用？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "Server RPC 从客户端调用在服务器上执行，适合请求服务器执行权威操作。Client RPC 从服务器调用在目标客户端执行，适合向特定玩家发送通知。NetMulticast 在服务器调用后会广播到所有相关客户端执行，适合不可靠的视觉效果和声音触发。",
    "source": "资料依据：Epic Games · Remote Procedure Calls"
  },
  {
    "id": "117",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "RepNotify 是什么？属性复制后如何触发客户端回调？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "UPROPERTY(ReplicatedUsing=OnRep_XXX) 标记的属性在客户端收到新值后自动调用 OnRep_XXX 函数。RepNotify 适合在属性变化后更新视觉效果、重新初始化组件或触发本地逻辑。首次复制和后续变化都会触发回调，但服务器自身不会执行 RepNotify。",
    "source": "资料依据：Epic Games · Property Replication and RepNotify"
  },
  {
    "id": "118",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "网络中的 Authority、AutonomousProxy 和 SimulatedProxy 分别是什么角色？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "Authority 是服务器上的权威副本，负责状态判定和属性同步。AutonomousProxy 是本地玩家的客户端副本，可以预测移动并接受服务器校正。SimulatedProxy 是其他玩家或 NPC 的客户端副本，只接收服务器同步的位置和动画信息。",
    "source": "资料依据：Epic Games · Network Roles and Proxy Types"
  },
  {
    "id": "119",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "条件复制和 SetReplicates 怎么控制 Actor 是否同步？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "SetReplicates 可以在运行时开关 Actor 的复制能力，关闭后服务器不再同步该 Actor 的属性。GetLifetimeReplicatedProps 中可以用 DOREPLIFETIME_CONDITION 设置条件复制，如 COND_OwnerOnly 只同步给拥有者，COND_SkipOwner 跳过拥有者。条件复制能显著减少网络带宽消耗。",
    "source": "资料依据：Epic Games · Conditional Replication"
  },
  {
    "id": "120",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "UE5 的序列化机制是怎么工作的？FArchive 扮演什么角色？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "FArchive 是 UE5 序列化的核心抽象，同一个接口既用于加载也用于保存。反射属性由引擎自动序列化，自定义序列化需要重载 Serialize 函数或使用 FArchive 的按字段操作。USaveGame 配合 SaveGameToSlot/LoadGameFromSlot 提供游戏存档的高层接口。",
    "source": "资料依据：Epic Games · Serialization and FArchive"
  },
  {
    "id": "121",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "网络预测和回滚是什么？客户端如何处理服务器校正？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "客户端在输入后立即预测移动结果以获得流畅体验，服务器收到输入后独立计算权威结果并发送给客户端。客户端收到服务器状态后与本地预测比较，差异超过阈值时执行回滚和重新模拟未确认的输入。CharacterMovementComponent 内置了完整的预测回滚框架。",
    "source": "资料依据：Epic Games · Network Prediction and Rollback"
  },
  {
    "id": "122",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "网络优先级和 Relevancy 如何决定哪些 Actor 被同步？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "NetPriority 数值越高的 Actor 越优先获得带宽，NetUpdateFrequency 指定期望的同步频率。Relevancy 判断 Actor 对特定客户端是否可见，超出 NetCullDistanceSquared 的 Actor 不会被同步。bAlwaysRelevant 可强制同步关键 Actor，bOnlyRelevantToOwner 限制只同步给拥有者。",
    "source": "资料依据：Epic Games · Network Priority and Relevancy"
  },
  {
    "id": "123",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "Build.cs 中的模块依赖如何管理？Public 和 Private 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "PublicDependencyModuleNames 中的模块会暴露给依赖本模块的其他模块，PrivateDependencyModuleNames 中的模块只在本模块编译时可见。选择时应尽量使用 Private 依赖以减少编译耦合，只有当公开头文件引用了依赖的类型时才需要 Public。",
    "source": "资料依据：Epic Games · Build.cs Module Dependencies"
  },
  {
    "id": "124",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "UE5 的模块编译流程是怎样的？UHT 在其中起什么作用？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "UBT 分析 Build.cs 和模块结构生成编译配置，UHT 扫描反射宏并生成注册代码和 generated.h，最后 C++ 编译器编译各模块源文件。修改 Build.cs 或反射声明后通常需要重新编译，UHT 不会自动重跑除非源文件发生变化或手动清理。",
    "source": "资料依据：Epic Games · Unreal Build Tool and Compilation"
  },
  {
    "id": "125",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "UE5 插件的基本结构是什么？如何创建自定义插件？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "插件由 .uplugin 描述文件、Source 目录和可选的 Content 目录组成，.uplugin 定义模块、类型和加载阶段。可通过编辑器插件浏览器或手动创建目录结构来创建。插件可以包含编辑器模块和运行时模块，编辑器模块应限制在 Editor Target 中加载。",
    "source": "资料依据：Epic Games · Plugin Structure and Creation"
  },
  {
    "id": "126",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "模块的加载阶段有哪些？如何选择正确的加载时机？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "模块可在 Default、PreDefault、PostDefault、PreLoadingScreen 等阶段加载。大多数游戏逻辑模块使用 Default，需要早于其他模块初始化的基础设施用 PreDefault，依赖大量其他模块的高层逻辑用 PostDefault。加载阶段错误会导致依赖模块尚未就绪的运行时崩溃。",
    "source": "资料依据：Epic Games · Module Loading Phases"
  },
  {
    "id": "127",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "API 宏和跨模块导出怎么使用？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "每个模块在 Build.cs 中定义 MYMODULE_API 宏，导出类和函数前加上该宏使其对其他模块可见。UCLASS、USTRUCT 和 UFUNCTION 标记的类型还需要在对应头文件中声明，且依赖模块的 Build.cs 必须引用该模块。缺少 API 宏会导致链接错误。",
    "source": "资料依据：Epic Games · API Macros and Module Exports"
  },
  {
    "id": "128",
    "group": "ue5",
    "category": "ue5/xr-vr",
    "title": "UE5 中如何实现 VR 立体渲染？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "UE5 通过 XR 系统自动为 HMD 生成左右眼视口和投影矩阵，StereoRendering 接口负责提交到各平台。Instanced Stereo 渲染在单次 draw call 中完成双眼，减少 CPU 开销。Multi-view 渲染进一步利用 Vulkan 扩展优化移动 VR 平台性能。",
    "source": "资料依据：Epic Games · VR Stereo Rendering"
  },
  {
    "id": "129",
    "group": "ue5",
    "category": "ue5/xr-vr",
    "title": "XR 输入系统和 MotionController 如何使用？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "MotionControllerComponent 提供手柄位置和旋转跟踪，Input Device 插件映射各平台的按键和轴。UE5 的 Enhanced Input 系统可以统一处理 VR 控制器的输入事件，Action-based 输入更适合跨平台 VR 应用。不同手柄的按键映射差异应由 Input Mapping Context 抽象处理。",
    "source": "资料依据：Epic Games · XR Input and Motion Controllers"
  },
  {
    "id": "130",
    "group": "ue5",
    "category": "ue5/xr-vr",
    "title": "VR 项目有哪些常见的性能优化手段？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "注视点渲染降低视野边缘的分辨率以节省 GPU 带宽，Fixed Foveated Rendering 在移动 VR 上效果显著。减少 draw call、使用实例化渲染、降低 Overdraw 和启用遮挡剔除是基础优化。VR 对帧率要求严格，应使用 Stat 和 Unreal Insights 定位瓶颈，避免每帧不必要的 Tick。",
    "source": "资料依据：Epic Games · VR Performance Optimization"
  },
  {
    "id": "131",
    "group": "ue5",
    "category": "ue5/xr-vr",
    "title": "OpenXR 在 UE5 中如何集成和使用？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "OpenXR 插件提供标准化的 XR 硬件接口，通过启用 OpenXR 插件可以统一支持各主流头显。XRSystem 和 IHeadMountedDisplay 接口抽象了底层差异，应用代码不直接依赖特定厂商 SDK。切换硬件时只需更换 OpenXR Runtime，无需修改项目代码。",
    "source": "资料依据：Epic Games · OpenXR Integration"
  },
  {
    "id": "132",
    "group": "ue5",
    "category": "ue5/xr-vr",
    "title": "VR 中的 UI 交互如何实现？World Space 和 Widget 组件怎么用？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "VR 中的 UI 通常使用 UWidgetComponent 以 World Space 模式渲染到 3D 空间中，配合射线检测或手柄光标进行交互。Widget Interaction Component 提供悬停和点击事件的模拟输入。UMG 控件需要适配 VR 的 DPI 和交互方式，平面 UI 在 VR 中会造成深度感知问题。",
    "source": "资料依据：Epic Games · VR UI and Widget Interaction"
  },
  {
    "id": "133",
    "group": "ue5",
    "category": "ue5/replication-rpc-serialization",
    "title": "SaveGame 系统怎么使用？如何管理版本兼容性？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "继承 USaveGame 并标记 UPROPERTY 字段，用 SaveGameToSlot 保存和 LoadGameFromSlot 加载。版本兼容需要在序列化时写入版本号，加载时根据版本执行迁移或拒绝加载。复杂项目可自定义 FArchive 或使用 FObjectAndNameAsStringProxyArchive 处理类重命名。",
    "source": "资料依据：Epic Games · SaveGame System and Versioning"
  },
  {
    "id": "134",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "异步加载资产时如何保证回调线程安全和 UObject 有效？",
    "difficulty": 4,
    "scopes": [
      "UE5"
    ],
    "answer": "StreamableManager 或异步加载回调可能在非游戏线程执行，不应在回调中直接操作 UObject。应在回调中捕获弱引用，切回游戏线程后用 IsValid 校验对象和 World 再执行逻辑。TStrongObjectPtr 或 FGCObject 可在后台保持对象存活，但必须在游戏线程创建和释放。",
    "source": "资料依据：Epic Games · Async Loading and Thread Safety"
  },
  {
    "id": "135",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "ChildActorComponent 的子 Actor 创建和销毁有哪些陷阱？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "ChildActorComponent 在注册或类配置变化时创建子 Actor，编辑器的 Construction Script 重建可能销毁旧实例。外部代码不能永久缓存 ChildActor 指针，应在重建后重新获取。组件负责子 Actor 的创建和销毁流程，手动干预可能导致生命周期不一致。",
    "source": "资料依据：Epic Games · Child Actor Component Lifecycle"
  },
  {
    "id": "136",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "进程和线程有什么区别？Windows 中如何创建进程？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "进程拥有独立的虚拟地址空间和资源，线程共享进程地址空间但拥有独立栈和执行上下文。CreateProcessW 创建新进程和主线程，需要正确设置 STARTUPINFO 的 cb 字段和 Unicode 环境块标志。创建成功后父进程应及时关闭不再持有的进程和线程句柄。",
    "source": "资料依据：Microsoft Learn · Process and Thread Concepts"
  },
  {
    "id": "137",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "进程和线程句柄的访问权限和等待语义是怎样的？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "句柄携带创建或打开时取得的访问权限，等待只是在内核对象进入终止信号态后返回，不会替调用者回收句柄。每个独立获得或复制的真实句柄都由持有者调用一次 CloseHandle，关闭句柄也不会终止仍在运行的进程或线程。",
    "source": "资料依据：Microsoft Learn · Process and Thread Handles"
  },
  {
    "id": "138",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "句柄继承有什么安全问题？如何收窄继承范围？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "传统继承要求 bInheritHandles 为 TRUE 且目标句柄带可继承标志，容易把无关句柄泄露给子进程。更稳妥的做法是用 PROC_THREAD_ATTRIBUTE_HANDLE_LIST 明确白名单，并通过约定的命令行或 IPC 协议把句柄值交给子进程验证。",
    "source": "资料依据：Microsoft Learn · Handle Inheritance and PROC_THREAD_ATTRIBUTE"
  },
  {
    "id": "139",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "Job Object 能限制进程组的哪些资源？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "通过 SetInformationJobObject 可设置进程数、CPU、内存限制和 JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE 等策略。把 Job 关联到完成端口可接收新进程加入、退出和资源限制消息。消息通知不能代替对 API 返回值和进程退出状态的检查。",
    "source": "资料依据：Microsoft Learn · Job Objects and Resource Limits"
  },
  {
    "id": "140",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "WaitForSingleObject 有哪些返回值？各表示什么？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "WAIT_OBJECT_0 表示对象已满足条件，WAIT_TIMEOUT 表示超时，WAIT_FAILED 后必须读取 GetLastError 获取具体错误。等待互斥体还可能得到 WAIT_ABANDONED 表示拥有线程异常退出。GUI 线程长期无限等待会阻塞消息泵，等待期间关闭句柄会产生未定义行为。",
    "source": "资料依据：Microsoft Learn · WaitForSingleObject Return Values"
  },
  {
    "id": "141",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "CreateThread 和 _beginthreadex 有什么区别？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "_beginthreadex 为 C 运行库建立线程状态，退出时自动释放。CreateThread 适合不依赖运行库状态的纯 Win32 入口。无论用哪种方式创建，创建方仍需等待或关闭返回的线程句柄以回收内核资源。",
    "source": "资料依据：Microsoft Learn · CreateThread versus _beginthreadex"
  },
  {
    "id": "142",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "线程优先级与调度有什么关系？提高优先级一定能保证实时性吗？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "Windows 用进程优先级类和线程相对优先级计算基础优先级，动态提升也会影响实际调度。因此设置值不是确定的执行时限，长期提高优先级可能让输入或 I/O 线程饥饿。硬实时要求不能依赖普通 Windows 线程优先级来保证。",
    "source": "资料依据：Microsoft Learn · Thread Priority and Scheduling"
  },
  {
    "id": "143",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "临界区（CRITICAL_SECTION）和互斥体（Mutex）有什么区别？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "临界区只能用于进程内，允许同一线程递归进入，体积小且无需显式销毁。互斥体是可命名、可跨进程等待的内核对象，拥有线程异常结束时等待者会收到 WAIT_ABANDONED。进程内简单同步优先用临界区，需要跨进程或 abandoned 语义时用互斥体。",
    "source": "资料依据：Microsoft Learn · Critical Section and Mutex Comparison"
  },
  {
    "id": "144",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "手动重置事件和自动重置事件有什么区别？如何选择？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "自动重置事件在释放一个等待者后自动回到无信号态，手动重置事件保持有信号态直到调用 ResetEvent，可唤醒所有现有等待者。事件只保存一个信号位，连续 SetEvent 不会累计次数。需要计数语义时应使用信号量或受锁保护的条件状态。",
    "source": "资料依据：Microsoft Learn · Event Objects Manual and Auto Reset"
  },
  {
    "id": "145",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "信号量（Semaphore）如何使用？如何避免超发？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "等待成功会把信号量计数减一，ReleaseSemaphore 按指定数量增加计数，超过创建时最大值会失败。代码应只为已成功取得的许可释放一次，并用作用域对象记录许可所有权，避免超时或异常分支误释放。",
    "source": "资料依据：Microsoft Learn · Semaphore Objects and ReleaseSemaphore"
  },
  {
    "id": "146",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "SRW Lock 有什么特点？它支持递归和升级吗？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "SRW Lock 支持共享读和独占写，体积小且无需显式销毁，适合读写频率差异大的场景。它不保证公平，不能递归获取独占锁，也没有原子的升级或降级操作。从共享锁切换到独占锁之间状态可能变化，必须重新检查受保护条件。",
    "source": "资料依据：Microsoft Learn · Slim Reader Writer Locks"
  },
  {
    "id": "147",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "条件变量如何配合临界区或 SRW Lock 使用？如何处理虚假唤醒？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "SleepConditionVariableCS 或 SleepConditionVariableSRW 原子释放锁并进入等待，返回前重新取得锁。返回可能来自虚假或被其他线程抢先消费的唤醒，因此必须在同一把锁下用循环重新检查谓词。超时和错误也要作为独立结果处理。",
    "source": "资料依据：Microsoft Learn · Condition Variables with Locks"
  },
  {
    "id": "148",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "死锁的四个必要条件是什么？如何预防？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "死锁要求互斥、持有并等待、不可剥夺和循环等待同时成立。工程上通常用固定锁顺序、一次取得多把锁、缩短持锁范围或超时协议打破其中至少一个条件。线程转储或 Wait Chain Traversal 可以帮助定位实际的等待环。",
    "source": "资料依据：Microsoft Learn · Deadlock Detection and Prevention"
  },
  {
    "id": "149",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "TLS 和 FLS 有什么区别？线程退出时如何清理？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "TlsAlloc 分配索引，TlsSetValue 保存每线程指针，系统不会自动释放指针指向的对象。FLS 支持回调，线程退出时自动调用清理函数。最后需由进程级所有者调用 TlsFree 或 FlsFree 释放索引，避免索引泄漏。",
    "source": "资料依据：Microsoft Learn · Thread Local Storage and Fiber Local Storage"
  },
  {
    "id": "150",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "什么是 APC？alertable wait 是什么？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "QueueUserAPC 把回调排入目标线程队列，目标线程进入 SleepEx、WaitForSingleObjectEx 等可警报等待后才会执行。APC 没有通用的撤回接口，取消应由共享状态或代际标记让回调自行退出。回调捕获的内存必须在执行前一直有效。",
    "source": "资料依据：Microsoft Learn · Asynchronous Procedure Calls"
  },
  {
    "id": "151",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "WSAStartup 和 WSACleanup 的配对规则是什么？",
    "difficulty": 2,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "WSAStartup 返回的 WSADATA 给出实际协商版本，调用方应检查版本是否满足需求，失败时不能继续调用 Winsock。每次成功的 WSAStartup 都要有一次 WSACleanup 配对，库或模块应明确由谁持有这段进程级初始化生命周期。",
    "source": "资料依据：Microsoft Learn · WSAStartup and WSACleanup"
  },
  {
    "id": "152",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "阻塞、非阻塞和重叠 IO 有什么区别？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "阻塞 socket 让调用线程等待直到操作完成。非阻塞 socket 在暂时无法推进时返回 WSAEWOULDBLOCK，依赖 readiness 通知重试。重叠 I/O 让每个操作携带 OVERLAPPED 和稳定缓冲区，WSA_IO_PENDING 表示稍后通过事件、回调或 IOCP 报告完成，它与非阻塞模式不是同一概念。",
    "source": "资料依据：Microsoft Learn · Blocking Nonblocking and Overlapped I/O"
  },
  {
    "id": "153",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "TCP 粘包和拆包问题怎么处理？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "TCP 只提供有序字节流，一次 send 与一次 recv 没有对应关系，应用协议必须用固定长度、长度前缀或可靠分隔符完成帧解析。recv 返回 0 表示对端有序关闭，仍应按协议处理已缓存的完整帧。粘包拆包是 TCP 编程中最常见的应用层问题。",
    "source": "资料依据：IETF RFC · RFC 9293 TCP byte stream semantics"
  },
  {
    "id": "154",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "select、WSAPoll 和 IOCP 在可扩展性上如何比较？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "select 每次扫描 fd_set，Windows 默认 FD_SETSIZE 限制集合容量，调用后集合被改写需重建。WSAPoll 接口更灵活但仍是 readiness 模型的线性扫描。大规模并发 I/O 通常转向 IOCP 模型，由内核通知完成事件而非轮询状态。",
    "source": "资料依据：Microsoft Learn · select WSAPoll and IOCP Scalability"
  },
  {
    "id": "155",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "WSAEventSelect 怎么用？为什么不能只靠 ResetEvent？",
    "difficulty": 2,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "WSAEventSelect 把指定 FD_* 事件关联到事件对象并自动把 socket 置为非阻塞模式。事件被置位后应调用 WSAEnumNetworkEvents 读取每一位及其错误码，这同时完成事件状态重置。只调用 ResetEvent 会丢失 Winsock 维护的事件信息。",
    "source": "资料依据：Microsoft Learn · WSAEventSelect and WSAEnumNetworkEvents"
  },
  {
    "id": "156",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "send 返回小于请求长度时怎么处理？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "send 成功值只是本次接受的字节数，应用需要记录偏移并继续发送剩余数据，不能把短写当成完整消息已发送。非阻塞模式遇到 WSAEWOULDBLOCK 后等待可写事件，重叠模式让缓冲区保持有效直到完成通知再推进发送队列。",
    "source": "资料依据：Microsoft Learn · Send Return Values and Partial Sends"
  },
  {
    "id": "157",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "recv 返回 0、SOCKET_ERROR 和正数分别表示什么？",
    "difficulty": 2,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "正数是实际收到的字节数，0 表示对端已有序关闭发送方向，SOCKET_ERROR 后用 WSAGetLastError 判断可重试或致命错误。无连接报文可以合法携带零长度数据，因此不能在所有 socket 类型上把 0 一律解释为断线。",
    "source": "资料依据：Microsoft Learn · Recv Return Values and Graceful Close"
  },
  {
    "id": "158",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "shutdown 和 closesocket 有什么区别？什么是半关闭？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "shutdown(SD_SEND) 禁止后续发送并在已排队数据发出后启动 TCP 有序关闭，接收方向仍可继续读取。shutdown 不是 closesocket，协议交换结束后仍要关闭句柄。SD_RECEIVE 和 SD_BOTH 的选择必须与应用层状态机一致，避免数据丢失。",
    "source": "资料依据：Microsoft Learn · Shutdown and Graceful Connection Closure；IETF RFC · RFC 9293 TCP half-close"
  },
  {
    "id": "159",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "TCP_NODELAY 对小包延迟有什么影响？什么时候该启用？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "TCP_NODELAY 禁用 Nagle 算法，减少小写入等待未确认数据的延迟，但可能产生更多小包降低链路效率。实时交互场景可以启用，同时仍应在应用层合并同一帧可一起发送的数据。批处理吞吐场景通常不必默认关闭 Nagle。",
    "source": "资料依据：Microsoft Learn · TCP_NODELAY and Nagle Algorithm"
  },
  {
    "id": "160",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "SO_REUSEADDR 和 SO_EXCLUSIVEADDRUSE 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "Windows 的 SO_REUSEADDR 可能允许强制绑定已被占用的地址，多个 socket 收到流量的行为不可靠。需要独占监听端口时应使用 SO_EXCLUSIVEADDRUSE 并在 bind 前设置，这是 Windows 特有的最佳实践。",
    "source": "资料依据：Microsoft Learn · SO_REUSEADDR and SO_EXCLUSIVEADDRUSE"
  },
  {
    "id": "161",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "SO_KEEPALIVE 和应用层心跳有什么区别？如何配合使用？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "SO_KEEPALIVE 在连接空闲后用传输层探测判断对端是否可达，默认周期通常不适合快速故障发现。应用层心跳可以携带会话语义并设置业务超时，但会增加流量。二者解决的层次不同，可按场景组合使用。",
    "source": "资料依据：Microsoft Learn · SO_KEEPALIVE and SIO_KEEPALIVE_VALS"
  },
  {
    "id": "162",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "UDP 的报文边界、丢包和乱序如何处理？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "UDP 保留每个数据报的边界但不保证送达、顺序、唯一性或拥塞控制，可靠性需要应用协议定义序号、重传和去重。接收缓冲区小于报文时可能返回 WSAEMSGSIZE 并截断数据，协议应限制最大报文并把分片风险纳入设计。",
    "source": "资料依据：IETF RFC · RFC 768 UDP Semantics；Microsoft Learn · Winsock Datagram Sockets"
  },
  {
    "id": "163",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "IPv4 和 IPv6 双栈监听有哪些兼容问题？",
    "difficulty": 3,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "双栈服务用 getaddrinfo(AF_UNSPEC) 遍历可用地址，并显式决定 IPV6_V6ONLY 策略。允许双栈时 IPv4 客户端可能以 IPv4-mapped IPv6 地址出现，日志、访问控制和地址比较必须先规范化表示，不能假设所有系统默认值相同。",
    "source": "资料依据：Microsoft Learn · Dual-Stack Sockets and IPv4-Mapped Addresses"
  },
  {
    "id": "164",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "getaddrinfo 的 hints 参数怎么用？解析失败如何处理？",
    "difficulty": 2,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "hints 用 family、socktype 和 protocol 限定结果，调用方应遍历链表逐个尝试创建与连接，而非只使用第一项。每个失败的 socket 都要关闭，结果用 freeaddrinfo 释放。不能阻塞的线程可使用 GetAddrInfoEx 等异步接口。",
    "source": "资料依据：Microsoft Learn · getaddrinfo and Name Resolution"
  },
  {
    "id": "165",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "OVERLAPPED 结构的生命周期如何保证？",
    "difficulty": 4,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "每个未完成操作需要独立且稳定的 OVERLAPPED，相关 WSABUF、数据内存和连接上下文都必须保留到最终完成通知到达。函数立即返回成功也不能复用这些对象，因为完成通知可能仍在排队。释放时应以观察到该操作的最终完成为边界。",
    "source": "资料依据：Microsoft Learn · Overlapped I/O Lifecycle"
  },
  {
    "id": "166",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "IOCP 的完成键和 GetQueuedCompletionStatus 如何使用？",
    "difficulty": 4,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "CreateIoCompletionPort 把句柄与完成键关联，后续完成包会带回该键和 OVERLAPPED 指针。常见做法让完成键指向连接上下文，自定义 OVERLAPPED 容器记录操作类型。返回 TRUE 表示成功完成，FALSE 且 lpOverlapped 非空表示操作失败，退出线程用 PostQueuedCompletionStatus 投递哨兵包。",
    "source": "资料依据：Microsoft Learn · IOCP Completion Keys and GQCS"
  },
  {
    "id": "167",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "取消重叠 IO 时有哪些竞态需要注意？",
    "difficulty": 4,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "CancelIoEx 只请求取消，操作可能已经完成或最终以 ERROR_OPERATION_ABORTED 结束。closesocket 也会触发未完成操作结束。应用仍要排空完成通知后再释放 OVERLAPPED、缓冲区和连接对象，不能把发出取消当成生命周期终点。",
    "source": "资料依据：Microsoft Learn · CancelIoEx and Cancellation Race"
  },
  {
    "id": "168",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "LoadLibrary 的搜索路径有哪些？如何避免 DLL 劫持？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "LoadLibraryEx 应使用绝对路径或 LOAD_LIBRARY_SEARCH_* 标志限定搜索目录，避免依赖当前目录和旧式默认顺序。每次成功加载通常增加模块引用计数，用 FreeLibrary 配对。GetModuleHandle 得到的句柄不增加计数，不能按同样方式释放。",
    "source": "资料依据：Microsoft Learn · LoadLibraryEx Search Flags"
  },
  {
    "id": "169",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "GetProcAddress 如何保证 ABI 一致性？",
    "difficulty": 4,
    "scopes": [
      "Win32"
    ],
    "answer": "GetProcAddress 按导出表中的精确名称或序号查找，不会替调用方推断 C++ 名字修饰。序号可能在稀疏导出表中得到无效的非空地址。调用端 typedef 必须与导出函数的参数、返回值和调用约定完全一致，跨编译器边界通常使用 extern \"C\" 和稳定的 C ABI。",
    "source": "资料依据：Microsoft Learn · GetProcAddress and Calling Conventions"
  },
  {
    "id": "170",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "DllMain 的通知机制有什么限制？哪些操作不能在 DllMain 中做？",
    "difficulty": 4,
    "scopes": [
      "Win32"
    ],
    "answer": "DllMain 在 DLL_PROCESS_ATTACH、DLL_THREAD_ATTACH 等通知中执行，但运行在 loader lock 下，不能等待其他线程、加载 DLL 或调用可能触发加载的函数。DLL_THREAD_DETACH 和 DLL_PROCESS_DETACH 可能因 TerminateThread 而被跳过，关键资源不能只依赖这些回调回收。",
    "source": "资料依据：Microsoft Learn · DllMain Notifications and Loader Lock"
  },
  {
    "id": "171",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "内存映射文件（Memory-Mapped File）是什么？有什么优势？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "CreateFileMapping 和 MapViewOfFile 把文件或共享内存映射到进程地址空间，可以像操作内存一样读写文件。优势包括避免用户态到内核态的数据拷贝、系统管理缓存和按需加载。多进程可以通过命名映射对象共享数据，但需要同步机制保证一致性。",
    "source": "资料依据：Microsoft Learn · Memory-Mapped Files"
  },
  {
    "id": "172",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "Windows 中的 Unicode 和宽字符如何处理？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "Windows API 提供 ANSI（后缀 A）和 Unicode（后缀 W）两套接口，应优先使用 W 版本。内部使用 UTF-16LE 编码，与 UTF-8 互转需要 MultiByteToWideChar 和 WideCharToMultiByte。文件路径、注册表键和命令行参数都应注意编码一致性。",
    "source": "资料依据：Microsoft Learn · Unicode and Character Sets in Windows"
  },
  {
    "id": "173",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "Windows 内核对象和句柄是什么关系？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "内核对象由系统管理并通过句柄表索引访问，句柄是进程局部的整数值。DuplicateHandle 可以在进程间复制或转移句柄，CloseHandle 减少引用计数。对象在引用计数归零且无等待者时才被系统释放，关闭句柄不等于销毁对象。",
    "source": "资料依据：Microsoft Learn · Kernel Objects and Handle Tables"
  },
  {
    "id": "174",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "CreateFile 的关键参数有哪些？如何正确设置共享模式？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "CreateFile 打开或创建文件，dwDesiredAccess 指定读写权限，dwShareMode 控制其他进程能否同时打开，dwCreationDisposition 决定文件存在或不存在时的行为。FILE_FLAG_OVERLAPPED 标志启用异步 I/O。共享模式不兼容会导致第二次打开失败。",
    "source": "资料依据：Microsoft Learn · CreateFile Parameters and Sharing Mode"
  },
  {
    "id": "175",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "Windows 的结构化异常处理（SEH）是什么？和 C++ 异常有什么区别？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "SEH 是操作系统级别的异常机制，__try/__except/__finally 处理访问违规、除零等硬件异常和系统错误。C++ 异常只处理 throw 抛出的对象，SEH 可以捕获更底层的故障。编译器通常不允许在同一函数中混用两者，__try 块中不能出现需要析构的局部变量。",
    "source": "资料依据：Microsoft Learn · Structured Exception Handling"
  }
];
