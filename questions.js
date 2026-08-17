window.CPP_INTERVIEW_QUESTIONS = [
  {
    "id": "001",
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
    "id": "002",
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
    "id": "003",
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
    "id": "004",
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
    "id": "005",
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
    "id": "006",
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
    "id": "007",
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
    "id": "008",
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
    "id": "009",
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
    "id": "010",
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
    "id": "011",
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
    "id": "012",
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
    "id": "013",
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
    "id": "014",
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
    "id": "015",
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
    "id": "016",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "指针和引用有什么区别？",
    "difficulty": 1,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "引用必须在创建时绑定到一个已存在的对象，之后不能重新绑定；指针可以不初始化，也可以随时指向不同对象。引用不能为空，指针可以为 nullptr。使用引用时语法更简洁，指针则需要解引用操作。",
    "source": "资料依据：cppreference · references and pointers"
  },
  {
    "id": "017",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "const 有哪些常见用法？const 指针和指向 const 的指针有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "const 可以修饰变量、函数参数、返回值、成员函数等，表达不可修改的语义。const int* p 表示指向的值不可变，int* const p 表示指针本身不可变。const 成员函数不能修改非 mutable 成员，是接口设计的重要契约。",
    "source": "资料依据：cppreference · const correctness"
  },
  {
    "id": "018",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "static 关键字在 C++ 中有哪些不同含义？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "static 在函数内部声明局部静态变量，只初始化一次且生命周期持续到程序结束。在命名空间作用域声明时限制链接为内部链接，只在当前翻译单元可见。静态成员变量和函数属于类而非对象，不依赖具体实例即可访问。",
    "source": "资料依据：cppreference · static specifier"
  },
  {
    "id": "019",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "虚函数和纯虚函数有什么区别？抽象类能实例化吗？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "虚函数允许派生类覆盖，实现运行时多态；纯虚函数在声明末尾加 = 0，要求派生类必须实现。含有纯虚函数的类是抽象类，不能直接实例化，只能作为基类使用。派生类如果未覆盖所有纯虚函数，仍然是抽象类。",
    "source": "资料依据：cppreference · abstract classes and pure virtual"
  },
  {
    "id": "020",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "volatile 关键字有什么作用？它能保证线程安全吗？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "volatile 告诉编译器不要优化对该变量的读写，每次必须从内存取值，主要用于内存映射 IO 和信号处理等特殊场景。它不提供任何线程同步保证，不能替代 atomic 或 mutex。C++ 中多线程共享变量应使用 std::atomic。",
    "source": "资料依据：cppreference · volatile qualifier"
  },
  {
    "id": "021",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "new 和 malloc 有什么区别？new 的过程做了什么？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "malloc 只分配原始内存并返回 void*，需要手动计算大小和类型转换。new 先调用 operator new 分配内存，再在分配的内存上调用构造函数初始化对象。delete 对应地先调用析构函数再释放内存，而 free 只做释放。",
    "source": "资料依据：cppreference · new expression vs operator new"
  },
  {
    "id": "022",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "什么是内存对齐？为什么结构体的大小可能大于成员大小之和？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "编译器会在成员之间和末尾插入填充字节，使每个成员的地址满足其自然对齐要求，提高 CPU 访问效率。结构体总大小是对最大成员对齐值的整数倍。可以使用 alignof 查询对齐要求，alignas 指定对齐。",
    "source": "资料依据：cppreference · alignment and padding"
  },
  {
    "id": "023",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "C++ 四种类型转换运算符各用在什么场景？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "static_cast 用于编译期可验证的类型转换，如数值类型之间或基类派生类指针之间。dynamic_cast 借助 RTTI 在运行时检查继承关系，向下转换失败返回 nullptr。const_cast 去除或添加 const 限定。reinterpret_cast 做底层的位模式重解释，风险最高。",
    "source": "资料依据：cppreference · casting operators"
  },
  {
    "id": "024",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "什么是内存泄漏？C++ 中常见的原因和检测方法有哪些？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "内存泄漏指动态分配的内存不再被使用但未被释放，长期运行会导致可用内存耗尽。常见原因包括忘记 delete、异常路径跳过释放、循环引用导致 shared_ptr 无法释放。使用智能指针、RAII 和工具如 Valgrind、AddressSanitizer 可以有效检测和预防。",
    "source": "资料依据：cppreference · memory management best practices"
  },
  {
    "id": "025",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "深拷贝和浅拷贝有什么区别？什么时候需要自定义拷贝构造函数？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "浅拷贝只复制指针值，两个对象指向同一块内存，析构时会发生重复释放。深拷贝分配新内存并复制数据，两个对象各自独立。当类管理动态资源时必须自定义拷贝构造函数和拷贝赋值运算符，或者使用智能指针和标准容器自动处理。",
    "source": "资料依据：cppreference · copy constructors and deep copy"
  },
  {
    "id": "026",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "vector 和 list 有什么区别？分别适合什么场景？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "vector 是连续内存存储，支持随机访问 O(1)，尾部插入均摊 O(1)，中间插入需要移动元素 O(n)。list 是双向链表，插入删除 O(1) 但不支持随机访问，迭代器在插入删除后仍有效。大多数场景优先选 vector，只有频繁中间插入且需要迭代器稳定时才选 list。",
    "source": "资料依据：cppreference · sequence containers comparison"
  },
  {
    "id": "027",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "emplace_back 和 push_back 有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "push_back 接受一个已构造的对象，可能需要一次额外的移动或拷贝操作。emplace_back 在容器内存中原位构造对象，将参数直接转发给构造函数，避免了临时对象的创建。当对象构造代价较高时 emplace_back 通常更高效。",
    "source": "资料依据：cppreference · emplace_back in place construction"
  },
  {
    "id": "028",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "什么是死锁？产生的条件和常见解决方法有哪些？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "死锁指两个或多个线程互相等待对方释放资源，导致所有线程永久阻塞。产生需要四个条件同时满足：互斥、持有并等待、不可抢占、循环等待。常用解决方法包括统一加锁顺序、使用 std::lock 同时锁定多个 mutex、采用 RAII 的 lock_guard 防止遗漏解锁。",
    "source": "资料依据：cppreference · deadlock avoidance"
  },
  {
    "id": "029",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "什么是线程池？为什么不建议频繁创建和销毁线程？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "线程池预先创建一组工作线程，从任务队列中取出任务执行，避免反复创建和销毁线程的开销。线程创建涉及内核对象分配和栈空间预留，频繁操作会显著影响性能。C++ 标准库没有内置线程池，但可以用 std::thread 和条件变量简单实现。",
    "source": "资料依据：cppreference · thread management patterns"
  },
  {
    "id": "030",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "什么是生产者消费者模型？用 C++ 标准库怎么实现？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "生产者线程向共享队列放入数据，消费者线程取出数据进行处理，通过条件变量协调双方的速度差异。生产者放入后 notify 消费者，消费者在队列为空时 wait。使用 mutex 保护队列，condition_variable 配合谓词避免虚假唤醒，是最经典的多线程协作模式。",
    "source": "资料依据：cppreference · condition_variable producer consumer"
  },
  {
    "id": "031",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "struct 和 class 在 C++ 中有什么区别？",
    "difficulty": 1,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "唯一的区别是默认访问权限和默认继承权限不同：struct 默认 public，class 默认 private。在 C++ 中 struct 可以有成员函数、构造函数和继承，功能和 class 完全一样。习惯上 struct 用于纯数据聚合，class 用于有行为的类型。",
    "source": "资料依据：cppreference · class and struct differences"
  },
  {
    "id": "032",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "this 指针是什么？什么时候需要用 this？",
    "difficulty": 1,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "this 是隐式传递给非静态成员函数的指针，指向调用该函数的对象本身。在构造函数中给成员赋值时区分同名参数、返回自身引用支持链式调用、以及把自己传给外部函数时都需要显式使用 this。静态成员函数没有 this 指针。",
    "source": "资料依据：cppreference · this pointer"
  },
  {
    "id": "033",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "友元函数和友元类是什么？什么场景下使用？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "友元声明允许指定的非成员函数或外部类访问当前类的私有和受保护成员，突破了封装限制。常见于运算符重载、工厂函数和需要紧密协作的两个类之间。友元关系是单向的且不能被继承，滥用会破坏封装性。",
    "source": "资料依据：cppreference · friend declarations"
  },
  {
    "id": "034",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "构造函数初始化列表和函数体内赋值有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "初始化列表直接调用成员的构造函数完成初始化，函数体内赋值则是先默认构造再赋值，对复杂类型多一次构造开销。const 成员、引用成员和没有默认构造函数的基类必须通过初始化列表初始化。初始化列表的顺序按成员声明顺序而非列表书写顺序。",
    "source": "资料依据：cppreference · constructor initializer list"
  },
  {
    "id": "035",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "什么是隐式转换？explicit 关键字有什么作用？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "C++ 允许单参数构造函数参与隐式类型转换，例如接受 int 的构造函数可以让函数参数自动从 int 转为对象类型。explicit 阻止这种隐式转换，只允许显式构造。避免意外转换导致的 bug 和性能问题，单参数构造函数通常应标记 explicit。",
    "source": "资料依据：cppreference · explicit specifier"
  },
  {
    "id": "036",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "什么是多重继承？菱形继承问题怎么解决？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "多重继承允许一个类同时继承多个基类，菱形继承指两个类继承同一基类、又被同一个类继承时产生两份基类子对象的问题。虚继承让中间层共享同一份基类子对象来解决歧义和二义性。UE 中通常避免多重继承，改用接口类（纯虚类）组合。",
    "source": "资料依据：cppreference · multiple and virtual inheritance"
  },
  {
    "id": "037",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "C++ 从源码到可执行文件要经过哪些步骤？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "预处理阶段展开宏、处理 #include 和条件编译。编译阶段将每个翻译单元翻译成目标文件，进行语法检查和代码生成。链接阶段将所有目标文件和库合并为可执行文件，解析符号引用。理解这个过程有助于排查头文件包含、重复定义和未解析符号等常见编译错误。",
    "source": "资料依据：cppreference · translation and linkage"
  },
  {
    "id": "038",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "函数指针和 std::function 有什么区别？回调函数怎么实现？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "函数指针直接指向函数地址，调用开销最小但不能捕获上下文。std::function 是类型擦除包装器，可以存储函数指针、lambda 和仿函数，使用更灵活但有堆分配开销。UE 中回调主要用委托系统（Delegate），C++ 项目中简单回调用函数指针，需要闭包时用 std::function。",
    "source": "资料依据：cppreference · function pointers and callbacks"
  },
  {
    "id": "039",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "C++ 中常用的运算符重载有哪些？有什么注意事项？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "operator==、operator< 用于比较，operator<< 用于流输出，operator[] 用于下标访问，operator() 用于仿函数。运算符重载应保持直觉语义，不要改变优先级和结合性。重载 == 时通常也要重载 !=，重载 < 时考虑全套比较运算符以支持标准算法和容器。",
    "source": "资料依据：cppreference · operator overloading"
  },
  {
    "id": "040",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "sizeof 在不同类型上的表现是什么？空类占多少字节？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "sizeof 返回类型或对象的字节数，空类大小为 1 字节以保证不同对象有不同地址。含有虚函数的类至少包含一个虚表指针（通常 8 字节），多重继承会有多个虚表指针。sizeof 是编译期常量，数组作为函数参数时退化为指针，sizeof 返回指针大小而非数组大小。",
    "source": "资料依据：cppreference · sizeof operator"
  },
  {
    "id": "041",
    "group": "cpp",
    "category": "cpp/core-language",
    "title": "位运算在游戏开发中有哪些常见用法？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "位掩码用单个整数的不同位表达多个布尔标志，节省内存且支持高效的组合查询。左移右移用于快速乘除 2 的幂，按位与用于提取特定位，按位或用于设置标志位。游戏开发中常用于组件标志、权限系统和网络协议中的紧凑数据编码。",
    "source": "资料依据：cppreference · bitwise operators"
  },
  {
    "id": "042",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "栈和堆的区别是什么？各自的优缺点？",
    "difficulty": 1,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "栈由编译器自动管理，速度快但空间有限（通常几 MB），局部变量和函数调用帧存放在栈上。堆由程序员手动管理（new/delete 或智能指针），空间大但分配慢且容易泄漏。栈对象生命周期确定，适合 RAII；堆对象可以跨作用域共享。",
    "source": "资料依据：cppreference · stack and heap allocation"
  },
  {
    "id": "043",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "什么是 placement new？它在游戏引擎中有什么用途？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "placement new 在预先分配的内存上构造对象，语法为 new (buffer) Type(args)，不会分配新内存。游戏引擎常用它在内存池的预分配块上构造对象，避免频繁的系统内存分配。使用 placement new 的对象需要手动调用析构函数销毁，不能用 delete。",
    "source": "资料依据：cppreference · placement new"
  },
  {
    "id": "044",
    "group": "cpp",
    "category": "cpp/types-expressions-initialization",
    "title": "assert 有什么作用？和异常处理有什么区别？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "assert 是调试期的断言宏，条件不满足时终止程序并输出诊断信息，帮助尽早发现逻辑错误。Release 构建中 NDEBUG 会移除 assert，零运行时开销。异常处理用于运行期可恢复的错误，而 assert 用于绝不应发生的情况。UE 用 check 和 ensure 宏提供类似功能。",
    "source": "资料依据：cppreference · assertions and debugging"
  },
  {
    "id": "045",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "构造函数和析构函数的执行顺序是怎样的？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "构造时先执行基类构造函数（按声明顺序），再按声明顺序初始化成员，最后执行派生类构造函数体。析构顺序完全相反：先执行派生类析构函数体，再逆序析构成员，最后逆序析构基类。理解这个顺序对避免访问未初始化或已销毁的成员至关重要。",
    "source": "资料依据：cppreference · construction and destruction order"
  },
  {
    "id": "046",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "虚继承是什么？它和普通继承有什么区别？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "虚继承让派生类在多重继承路径中只保留一份虚基类子对象，解决菱形继承的二义性问题。虚基类的构造由最派生类负责，中间层的初始化会被忽略。代价是额外的虚基表指针和间接访问开销。UE 中通常避免多重继承，改用接口和组合。",
    "source": "资料依据：cppreference · virtual inheritance"
  },
  {
    "id": "047",
    "group": "cpp",
    "category": "cpp/classes-object-model",
    "title": "什么是空基类优化（EBO）？它有什么实际价值？",
    "difficulty": 3,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "空基类优化允许空基类子对象不占用额外空间，派生类的大小不会因为继承空类而增加。标准库中大量使用这一优化，比如 empty base 策略让 allocator 和比较器不增加容器体积。C++11 的 [[no_unique_address]] 属性将类似优化扩展到了成员变量。",
    "source": "资料依据：cppreference · empty base optimization"
  },
  {
    "id": "048",
    "group": "cpp",
    "category": "cpp/smart-pointers-allocators",
    "title": "引用计数智能指针有什么性能开销？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "shared_ptr 的引用计数增减是原子操作，多线程下有额外的同步开销。每次拷贝、赋值和析构都会修改计数，频繁传递的短生命周期对象开销明显。控制块需要额外的堆内存，make_shared 可以把对象和控制块合在一次分配中。性能敏感场景优先用 unique_ptr。",
    "source": "资料依据：cppreference · shared_ptr performance overhead"
  },
  {
    "id": "049",
    "group": "cpp",
    "category": "cpp/stl",
    "title": "游戏开发中常用的 STL 容器有哪些？怎么选择？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "vector 是最常用的容器，连续内存、随机访问 O(1)、尾部插入均摊 O(1)。map/unordered_map 用于键值查找，string 用于文本处理。deque 适合两端操作，list 适合频繁中间插入。游戏开发中通常优先用 vector 配合 reserve，只在有明确需求时才换其他容器。",
    "source": "资料依据：cppreference · STL container selection"
  },
  {
    "id": "050",
    "group": "cpp",
    "category": "cpp/value-categories-move-forwarding",
    "title": "什么是移动语义？它解决了什么问题？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "移动语义允许把即将销毁的对象的资源直接转移给新对象，避免深拷贝。std::move 把左值转为右值引用，让编译器选择移动构造或移动赋值而非复制。对于管理堆内存、文件句柄等重资源的类型，移动操作比复制高效得多，是 C++11 最重要的特性之一。",
    "source": "资料依据：cppreference · move semantics overview"
  },
  {
    "id": "051",
    "group": "cpp",
    "category": "cpp/standard-concurrency",
    "title": "C++ 多线程编程中有哪些常见陷阱？",
    "difficulty": 2,
    "scopes": [
      "C++11",
      "C++14",
      "C++17"
    ],
    "answer": "数据竞争是最大风险，多个线程同时读写同一变量且至少一个是写操作时会产生未定义行为。死锁由多个线程互相等待对方释放锁导致。悬空引用发生在被捕获的变量在线程执行前已销毁。使用 mutex 保护共享数据、避免嵌套加锁、用 RAII 锁管理可以规避大部分问题。",
    "source": "资料依据：cppreference · multithreading pitfalls"
  },
  {
    "id": "052",
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
    "id": "053",
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
    "id": "054",
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
    "id": "055",
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
    "id": "056",
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
    "id": "057",
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
    "id": "058",
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
    "id": "059",
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
    "id": "060",
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
    "id": "061",
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
    "id": "062",
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
    "id": "063",
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
    "id": "064",
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
    "id": "065",
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
    "id": "066",
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
    "id": "067",
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
    "id": "068",
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
    "id": "069",
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
    "id": "070",
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
    "id": "071",
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
    "id": "072",
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
    "id": "073",
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
    "id": "074",
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
    "id": "075",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UPROPERTY 常用的 specifier 有哪些？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "EditAnywhere 允许在类默认值和实例上修改属性，EditDefaultsOnly 和 EditInstanceOnly 分别限制到其中之一，Visible 系列只改变详情面板的可读性。BlueprintReadOnly、Config、Replicated 等规则另行决定脚本访问、配置保存或网络同步，不能由 Edit/Visible specifier 推导其他能力。",
    "source": "资料依据：Epic Games · Property Specifiers and Editor Visibility"
  },
  {
    "id": "076",
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
    "id": "077",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "Actor 的生命周期是怎样的？从创建到 BeginPlay 经历了什么？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "C++ 构造函数为 CDO 和每个实例执行，只适合设置默认值和创建默认子对象，此时不能假定已有有效 World。OnConstruction 在属性初始化后执行并可被编辑器多次调用，BeginPlay 在组件注册完成后触发，适合一次性运行时初始化。混淆三者的时机是 Actor 相关 bug 的常见来源。",
    "source": "资料依据：Epic Games · Actor Lifecycle: Construction and BeginPlay"
  },
  {
    "id": "078",
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
    "id": "079",
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
    "id": "080",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "Actor 销毁时的清理顺序是怎样的？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "EndPlay 覆盖销毁、关卡切换、停止 PIE 等多种离场原因，适合停止 Timer、异步任务和委托。OnDestroyed 更偏向 Actor 被 Destroy 的通知，C++ 析构发生得更晚且此时 World 可能已不可用。主要玩法清理应放在 EndPlay 中，析构函数不应承担依赖 World 的清理逻辑。",
    "source": "资料依据：Epic Games · Actor EndPlay and Destruction"
  },
  {
    "id": "081",
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
    "id": "082",
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
    "id": "083",
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
    "id": "084",
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
    "id": "085",
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
    "id": "086",
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
    "id": "087",
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
    "id": "088",
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
    "id": "089",
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
    "id": "090",
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
    "id": "091",
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
    "id": "092",
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
    "id": "093",
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
    "id": "094",
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
    "id": "095",
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
    "id": "096",
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
    "id": "097",
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
    "id": "098",
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
    "id": "099",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "UObject 的构造和初始化流程是怎样的？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "UObject 通过 NewObject 或 ConstructObject 创建时，先调用 C++ 构造函数，然后引擎调用 PostInitProperties 做属性后处理。从磁盘加载的对象会在反序列化完成后调用 PostLoad。Serialize、Initialize、BeginPlay 等回调按生命周期顺序依次触发，理解这个顺序对正确初始化组件和资源至关重要。",
    "source": "资料依据：Epic Games · UObject initialization lifecycle"
  },
  {
    "id": "100",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "Actor 和 Component 之间的通信方式有哪些？各有什么优缺点？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "Actor 可以通过 GetComponentByClass 获取组件引用后直接调用方法，适合强类型访问。组件之间可以通过 GetOwner 获取所属 Actor 再访问其他组件，但耦合度较高。委托和事件分发是最解耦的方式，适合跨组件通信。对于全局通信，Subsystem 或 GameInstance 作为中介者更合适。",
    "source": "资料依据：Epic Games · Actor Component communication patterns"
  },
  {
    "id": "101",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "UE5 中 Event 和 Delegate 有什么区别？各用在什么场景？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "Delegate 是 C++ 层面的回调机制，支持单播和多播，类型安全且性能高。Event 在蓝图层面使用更广泛，蓝图 Event 可以被子类覆盖，支持网络复制标记。BlueprintAssignable 的 Event 可以从 C++ 触发、在蓝图中绑定，是 C++ 和蓝图交互的主要回调方式。简单回调用 Delegate，需要蓝图扩展时用 Event。",
    "source": "资料依据：Epic Games · Delegate vs Event usage"
  },
  {
    "id": "102",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "Tick 和 Timer 有什么区别？什么情况下用哪个？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "Tick 每帧调用，适合需要每帧更新的逻辑如摄像机跟随和物理模拟，但开销大且帧率不稳定。定时器通过 SetTimer 按固定间隔触发，精度更高且不影响帧率，适合技能冷却、延迟执行和周期性检查。能用定时器的场景就不开 Tick，减少性能开销。",
    "source": "资料依据：Epic Games · Tick and Timer management"
  },
  {
    "id": "103",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "UE5 的碰撞和追踪系统是怎么工作的？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "碰撞通过 Collision Channel 和 Collision Response 控制哪些物体之间可以相互检测和阻挡。Line Trace（射线检测）和 Sweep（形状扫描）用于即时查询场景中的碰撞信息。Overlap Event 检测重叠但不阻挡，OnComponentHit 处理物理碰撞。碰撞预设（Collision Preset）简化了通道配置。",
    "source": "资料依据：Epic Games · collision and trace system"
  },
  {
    "id": "104",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "UE5 的 Gameplay 框架有哪些核心类？各自负责什么？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "GameMode 定义游戏规则（仅服务器存在），GameState 同步游戏状态给所有客户端。PlayerController 处理玩家输入，PlayerState 保存玩家数据。Pawn/Character 是玩家或 AI 的化身，HUD 和 Widget 负责 UI 显示。理解这些类的职责和生命周期是搭建游戏框架的基础。",
    "source": "资料依据：Epic Games · gameplay framework classes"
  },
  {
    "id": "105",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "DataTable 和 DataAsset 有什么区别？各用在什么场景？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "DataTable 是基于行的数据表，适合存储大量同构记录如怪物属性、道具配置，通过 CSV 或 JSON 导入。DataAsset 是继承自 UPrimaryDataAsset 的独立资产类，可以有自定义属性和逻辑，适合结构复杂的配置。DataTable 轻量但类型不严格，DataAsset 类型安全且支持异步加载。",
    "source": "资料依据：Epic Games · DataTable and DataAsset usage"
  },
  {
    "id": "106",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "Gameplay Ability System（GAS）的核心概念有哪些？",
    "difficulty": 3,
    "scopes": [
      "UE5"
    ],
    "answer": "GAS 围绕三个核心概念构建：Ability（技能/行为）、Attribute（数值属性如血量）、Effect（对属性的修改）。AbilitySystemComponent 是入口点，管理所有能力的激活和属性变化。GameplayTag 用于标记状态和分类，替代布尔标志和枚举。GAS 提供网络同步、冷却、资源消耗等开箱即用的机制。",
    "source": "资料依据：Epic Games · Gameplay Ability System overview"
  },
  {
    "id": "107",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "UMG 和 Slate 有什么区别？UE5 的 UI 系统怎么选择？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "UMG 是蓝图友好的 UI 框架，基于 UUserWidget，可视化编辑且支持动画和绑定。Slate 是底层 C++ UI 框架，UMG 底层就是 Slate，性能更好但开发效率低。游戏 UI 通常用 UMG 快速原型和迭代，编辑器工具和性能关键的 UI 用 Slate。两者可以混合使用。",
    "source": "资料依据：Epic Games · UMG and Slate UI framework"
  },
  {
    "id": "108",
    "group": "ue5",
    "category": "ue5/actor-component-subsystem",
    "title": "World Partition 是什么？它和旧的世界组合有什么区别？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "World Partition 是 UE5 的大世界管理系统，自动将世界划分为网格并按距离加载卸载，无需手动划分关卡。支持 HLOD 自动合并远处物体降低渲染开销，One File Per Actor 让多人协作不冲突。旧版 World Composition 需要手动设置流式关卡和层级，已被 World Partition 取代。",
    "source": "资料依据：Epic Games · World Partition streaming"
  },
  {
    "id": "109",
    "group": "ue5",
    "category": "ue5/uobject-reflection-gc",
    "title": "Soft Reference 和 Hard Reference 有什么区别？怎么避免资产加载问题？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "Hard Reference 直接指向资产，加载引用者时目标资产必须同时加载，可能导致连锁加载和卡顿。Soft Reference（TSoftObjectPtr、FSoftObjectPath）只存储路径，按需异步加载，避免不必要的内存占用。大型项目中应多用软引用配合异步加载，用 Asset Manager 统一管理加载和释放策略。",
    "source": "资料依据：Epic Games · soft and hard asset references"
  },
  {
    "id": "110",
    "group": "ue5",
    "category": "ue5/delegate-interface-async",
    "title": "蓝图和 C++ 之间怎么通信？有哪些方式？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "C++ 暴露给蓝图：UFUNCTION(BlueprintCallable) 让蓝图调用 C++ 函数，UPROPERTY(BlueprintReadWrite) 让蓝图读写属性，BlueprintNativeEvent 可以从蓝图覆盖 C++ 实现。蓝图暴露给 C++：通过反射系统查找属性和调用函数，或使用 Delegate 回调。实践中核心逻辑用 C++，表现层用蓝图。",
    "source": "资料依据：Epic Games · Blueprint and C++ communication"
  },
  {
    "id": "111",
    "group": "ue5",
    "category": "ue5/modules-plugins-buildcs",
    "title": "UE5 的资产管理系统怎么工作？Asset Manager 有什么作用？",
    "difficulty": 2,
    "scopes": [
      "UE5"
    ],
    "answer": "Asset Manager 提供统一的资产加载、卸载和注册接口。通过 Primary Asset Type 和 Primary Asset Id 标识资产，支持同步加载、异步加载和批量加载。Soft Reference 配合 Asset Manager 可以按需加载资产，避免启动时加载所有资源。Asset Registry 在编辑器中提供资产查询和依赖分析功能。",
    "source": "资料依据：Epic Games · Asset Manager and loading"
  },
  {
    "id": "112",
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
    "id": "113",
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
    "id": "114",
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
    "id": "115",
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
    "id": "116",
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
    "id": "117",
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
    "id": "118",
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
    "id": "119",
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
    "id": "120",
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
    "id": "121",
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
    "id": "122",
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
    "id": "123",
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
    "id": "124",
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
    "id": "125",
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
    "id": "126",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "recv 的返回值有哪些含义？",
    "difficulty": 2,
    "scopes": [
      "Win32",
      "Winsock"
    ],
    "answer": "正数是实际收到的字节数，0 表示对端已有序关闭发送方向，SOCKET_ERROR 后用 WSAGetLastError 判断可重试或致命错误。无连接报文可以合法携带零长度数据，因此不能在所有 socket 类型上把 0 一律解释为断线。",
    "source": "资料依据：Microsoft Learn · Recv Return Values and Graceful Close"
  },
  {
    "id": "127",
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
    "id": "128",
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
    "id": "129",
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
    "id": "130",
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
    "id": "131",
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
    "id": "132",
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
    "id": "133",
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
    "id": "134",
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
    "id": "135",
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
    "id": "136",
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
    "id": "137",
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
    "id": "138",
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
    "id": "139",
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
    "id": "140",
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
    "id": "141",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "Windows 的结构化异常处理（SEH）是什么？和 C++ 异常有什么区别？",
    "difficulty": 3,
    "scopes": [
      "Win32"
    ],
    "answer": "SEH 是操作系统级别的异常机制，__try/__except/__finally 处理访问违规、除零等硬件异常和系统错误。C++ 异常只处理 throw 抛出的对象，SEH 可以捕获更底层的故障。编译器通常不允许在同一函数中混用两者，__try 块中不能出现需要析构的局部变量。",
    "source": "资料依据：Microsoft Learn · Structured Exception Handling"
  },
  {
    "id": "142",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "什么是原子操作？Windows 提供的 Interlocked 函数有哪些？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "原子操作是不可被中断的最小执行单元，保证在多线程环境下对共享变量的读写不会出现数据竞争。Windows 提供 InterlockedIncrement、InterlockedDecrement、InterlockedExchange、InterlockedCompareExchange 等函数。C++11 的 std::atomic 在 Windows 上通常映射到这些 API。",
    "source": "资料依据：Microsoft Learn · Interlocked functions"
  },
  {
    "id": "143",
    "group": "windows",
    "category": "windows/process-thread-sync",
    "title": "协程的基本概念是什么？和用户态线程有什么区别？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "协程是可以主动挂起和恢复的函数，在用户态管理执行状态，切换开销远小于线程上下文切换。和用户态线程不同，协程的调度由程序员控制而非操作系统抢占，适合高并发 IO 密集场景。C++20 引入了语言级协程支持，Windows 上也提供了 Fiber API 作为替代。",
    "source": "资料依据：Microsoft Learn · Fibers and coroutine concepts"
  },
  {
    "id": "144",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "高并发服务器有哪些常见架构模型？各有什么优缺点？",
    "difficulty": 2,
    "scopes": [
      "Winsock",
      "IOCP"
    ],
    "answer": "每连接一线程模型简单但线程切换开销大，只适合低并发。Reactor 模型用少量线程通过 IO 多路复用处理大量连接，适合 Linux 的 epoll。IOCP 模型让操作系统内核管理异步 IO 完成通知，工作线程从完成队列取结果处理，是 Windows 上扩展性最好的服务器架构。",
    "source": "资料依据：Microsoft Learn · server architecture models"
  },
  {
    "id": "145",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "什么是 Zero Copy？Windows 上有什么实现方式？",
    "difficulty": 3,
    "scopes": [
      "Winsock",
      "IOCP"
    ],
    "answer": "Zero Copy 避免数据在内核缓冲区和用户缓冲区之间的多余拷贝，减少 CPU 和内存带宽消耗。Linux 上常用 sendfile 和 splice，Windows 上 TransmitFile 和 TransmitPackets 可以直接把文件内容发送到 socket。WSARecv 配合 FILE_FLAG_OVERLAPPED 也能减少一次拷贝。",
    "source": "资料依据：Microsoft Learn · TransmitFile zero copy"
  },
  {
    "id": "146",
    "group": "windows",
    "category": "windows/winsock-protocol-iocp",
    "title": "网络编程中缓冲区设计的要点是什么？",
    "difficulty": 2,
    "scopes": [
      "Winsock",
      "IOCP"
    ],
    "answer": "接收缓冲区需要根据协议的报文边界设计，TCP 是流式协议没有天然边界，需要自定义长度前缀或分隔符来划分消息。发送缓冲区应支持部分写入后继续发送剩余数据。环形缓冲区适合高频读写场景，减少内存分配次数和数据拷贝。",
    "source": "资料依据：Microsoft Learn · network buffer design"
  },
  {
    "id": "147",
    "group": "windows",
    "category": "windows/dll-files-mmap-unicode-handles",
    "title": "什么是内存池？相比直接调用 malloc/new 有什么优势？",
    "difficulty": 2,
    "scopes": [
      "Win32"
    ],
    "answer": "内存池预先分配一大块内存，按固定大小或分级大小管理空闲块，分配和释放只需链表操作，O(1) 时间完成。相比 malloc/new 避免了频繁向操作系统申请内存的开销和碎片问题。游戏引擎广泛使用内存池管理高频创建销毁的对象，如粒子、子弹和 AI 节点。",
    "source": "资料依据：Microsoft Learn · memory pool allocation"
  }
];
