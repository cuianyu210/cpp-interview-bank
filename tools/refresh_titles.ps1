[CmdletBinding()]
param([string]$DataPath)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($DataPath)) {
    $DataPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..\questions.js'
}
$resolvedPath = (Resolve-Path -LiteralPath $DataPath).Path
$source = [IO.File]::ReadAllText($resolvedPath, [Text.Encoding]::UTF8)
$match = [regex]::Match($source, '(?s)^\s*window\.CPP_INTERVIEW_QUESTIONS\s*=\s*(\[.*\])\s*;?\s*$')
if (-not $match.Success) { throw 'questions.js is not a strict JSON assignment' }
$questions = $match.Groups[1].Value | ConvertFrom-Json

# Canonical stems are deliberately explicit. This lets the refresh remain stable
# even when an older generated suffix was accidentally concatenated to a title.
$topicSeeds = @{
 'cpp/core-language' = @('声明与定义','extern 接口','ODR 约束','名称查找','ADL 调用','using 声明','constexpr 与 constinit','if constexpr')
 'cpp/types-expressions-initialization' = @('整型提升','通常算术转换','列表初始化','直接初始化与拷贝初始化','聚合初始化','默认成员初始化')
 'cpp/classes-object-model' = @('特殊成员函数生成','五法则与零法则','trivial 属性','虚函数分派','虚析构函数','override 与 final','多重继承','虚继承')
 'cpp/lifetime-raii' = @('对象生命周期','placement new','std::launder','临时对象','悬空引用','RAII 包装','scope guard','异常安全')
 'cpp/smart-pointers-allocators' = @('unique_ptr 所有权','shared_ptr 控制块','weak_ptr 观察','make_shared','别名构造','enable_shared_from_this')
 'cpp/value-categories-move-forwarding' = @('左值与右值','引用折叠','转发引用','std::move','std::forward','移动构造 noexcept','拷贝消除','NRVO')
 'cpp/templates-sfinae-traits-constexpr' = @('模板参数种类','函数模板推导','非类型模板参数','模板默认参数','偏特化','全特化','SFINAE','enable_if','void_t','检测惯用法','if constexpr','type_traits')
 'cpp/containers-iterators' = @('vector 扩容','deque 失效规则','list splice','forward_list','array','map 比较器','unordered_map 桶','Hash 与 KeyEqual','string 小字符串优化','string_view','迭代器类别','const_iterator')
 'cpp/lambdas-utility-types' = @('Lambda 按值捕获','Lambda 按引用捕获','初始化捕获','mutable Lambda','泛型 Lambda','无捕获 Lambda 转函数指针')
 'cpp/exceptions-rtti' = @('按值抛出按引用捕获','异常层次捕获顺序','noexcept','栈展开','函数 try 块')
 'cpp/standard-concurrency' = @('std::thread 生命周期','join 与 detach','mutex 类型','lock_guard','unique_lock','scoped_lock','std::lock','condition_variable','虚假唤醒','notify_one 与 notify_all','future 与 promise','async 策略')
 'cpp/strings-time-files-streams' = @('basic_string traits','字符串失效规则','locale','正则表达式','ios 状态位','streambuf')
 'ue5/uobject-reflection-gc' = @('UObject 反射信息','UCLASS 与 USTRUCT','UFUNCTION 与 UPROPERTY','UHT 头文件解析','GENERATED_BODY','属性编辑器权限','Outer 层级','NewObject','对象标志','GC 可达性','TObjectPtr','TWeakObjectPtr')
 'ue5/actor-component-subsystem' = @('Actor 构造函数','OnConstruction','BeginPlay','SpawnActor 参数','组件注册','根组件层级','CreateDefaultSubobject','运行时 CreateComponent','组件 Tick 依赖','PrimaryComponentTick','WorldSubsystem','GameInstanceSubsystem','Subsystem 初始化','ChildActorComponent','组件模板','Actor 销毁回调')
 'ue5/delegate-interface-async' = @('单播 Delegate','多播 Delegate','动态 Delegate','AddUObject 与 AddRaw','Delegate 解绑','BlueprintNativeEvent','UINTERFACE','接口指针转换','AsyncTask','线程池任务','TFuture 与 TPromise','Latent Action','异步加载回调','取消异步任务')
 'ue5/replication-rpc-serialization' = @('Actor 复制开关','ReplicatedUsing','DOREPLIFETIME','条件复制','服务器权威','NetMulticast RPC','Server RPC','Client RPC','可靠 RPC','组件复制','子对象复制','Fast Array Serializer','NetDeltaSerialize','FArchive 序列化','SaveGame 字段','USaveGame 版本','重连恢复','NetUpdateFrequency')
 'ue5/modules-plugins-buildcs' = @('Runtime 模块','Editor 模块','Build.cs 公有依赖','Build.cs 私有依赖','UHT 模块依赖','插件 LoadingPhase','第三方库接入','模块 API 宏')
 'windows/process-thread-sync' = @('CreateProcess','进程和线程句柄','句柄继承','Job Object','WaitForSingleObject','TLS','CreateThread 与 _beginthreadex','线程优先级','APC','临界区','互斥体','信号量','事件','SRWLock','条件变量','Interlocked','WaitOnAddress','INIT_ONCE','死锁条件','锁顺序','TLS 清理','进程终止回调')
 'windows/winsock-protocol-iocp' = @('WSAStartup','阻塞与非阻塞 socket','bind、listen、accept','connect 超时','TCP 字节流','套接字复用','select 与 WSAPoll','WSAEventSelect','部分 send','recv 返回值','shutdown 半关闭','SO_KEEPALIVE','UDP 报文','IPv4 与 IPv6','getaddrinfo','Overlapped I/O','IOCP 完成键','GetQueuedCompletionStatus','多个 recv 请求','取消套接字 I/O','TCP_NODELAY','TLS 会话')
 'windows/dll-files-mmap-unicode-handles' = @('LoadLibraryEx','GetProcAddress','DLLMain','卸载 DLL','CreateFile 共享模式','句柄继承','DuplicateHandle','ReadFile 与 WriteFile','FlushFileBuffers','CreateFileMapping','MapViewOfFile','跨进程映射','UTF-16 与 UTF-8','命名对象 Unicode','CloseHandle','伪句柄')
}

$suffixes = @{
 'cpp/core-language' = @('在编译、链接和运行时分别由哪些规则决定？','放在头文件并跨翻译单元使用时，怎样避免 ODR 与链接问题？','它与最接近的语言特性边界在哪里，面试中常见误区是什么？','遇到编译器诊断差异时，应先核对哪些标准条款？','如何用一个最小例子区分声明、定义和可见性？','它会改变名称查找、重载或符号生成的哪一步？')
 'cpp/types-expressions-initialization' = @('在重载解析中会发生哪些隐式转换，窄化如何被拒绝？','它与列表初始化、直接初始化和拷贝初始化的候选顺序有什么关系？','遇到求值顺序争议时，怎样判断结果是否未定义？','它对 const、引用绑定和临时对象生命周期有什么影响？','如何设计一个最小调用例子验证转换优先级？','与显式转换、转换运算符组合时有哪些边界？')
 'cpp/classes-object-model' = @('编译器何时隐式生成、删除或抑制特殊成员函数？','继承和虚函数分派会怎样改变对象布局与析构行为？','面向多态删除时，基类析构函数需要满足什么条件？','如何用 type_traits 或最小类层次验证它的属性？','它与拷贝/移动构造的异常保证怎样联动？','在 ABI 稳定的接口中应避免哪些对象模型假设？')
 'cpp/lifetime-raii' = @('对象从构造、临时物化到析构的顺序是什么？','异常、提前 return 和 placement new 场景下如何保证只释放一次？','临时对象、悬空引用与 std::launder 的边界分别在哪里？','如何让资源所有权在类型和作用域上清晰可见？','发生构造失败或部分初始化时，哪些析构函数会运行？','如何写一个可测试的生命周期最小示例？')
 'cpp/smart-pointers-allocators' = @('所有权、控制块和线程安全保证分别是什么？','它与裸指针、引用及观察者句柄如何划分职责？','循环引用、自定义删除器或跨 DLL 释放时怎样设计？','别名构造、make_shared 与 enable_shared_from_this 各解决什么问题？','在异常路径和容器扩容中如何保持资源契约？','如何判断一次拷贝是在复制对象还是共享控制块？')
 'cpp/value-categories-move-forwarding' = @('它如何影响重载决议和模板参数推导？','和 std::move、std::forward 组合时，哪些写法会错误地转移资源？','移动构造或移动赋值后，对象允许处于什么状态？','C++11、C++14 和 C++17 的拷贝消除规则有什么差异？','引用折叠和完美转发在泛型接口中怎样协作？','如何用重载探针验证一个表达式的值类别？')
 'cpp/templates-sfinae-traits-constexpr' = @('数组、函数、cv/ref 和 forwarding reference 场景下推导如何变化？','偏特化、全特化、SFINAE、void_t 和 if constexpr 应如何取舍？','依赖名、两阶段查找与错误诊断之间有什么关系？','traits、index_sequence 和折叠表达式如何组成可复用接口？','实例化失败时，哪些错误会被 SFINAE 吞掉，哪些不会？','如何限制模板接口并让编译器给出可读诊断？')
 'cpp/containers-iterators' = @('插入、删除、扩容及迭代器失效规则如何比较？','比较器、哈希、桶和异常保证分别是什么？','容器适配器、splice、node_handle 和 allocator-aware 接口适用于哪些场景？','元素移动、内存局部性和稳定引用之间如何权衡？','如何为边界操作设计一个覆盖失效规则的最小测试？','不同容器的复杂度保证在接口选型中怎样落地？')
 'cpp/lambdas-utility-types' = @('按值、按引用和初始化捕获会怎样影响生命周期与复制成本？','泛型、mutable 和无捕获闭包的类型与转换规则有什么不同？','与 std::function、bind、invoke 或函数指针组合时，类型擦除成本如何取舍？','tuple、pair、apply、exchange、optional、variant 和 any 如何组合？','回调跨线程或异步执行时，如何避免捕获悬空对象？','如何从闭包类型和调用运算符判断其可复制性？')
 'cpp/exceptions-rtti' = @('异常对象、栈展开和 catch 顺序如何影响资源释放？','noexcept、terminate、析构函数和移动操作之间有什么关系？','dynamic_cast、typeid、static_cast 和 reinterpret_cast 的合法边界如何判断？','如何区分编译期错误、异常安全保证和未定义行为？','跨模块抛出异常或使用 RTTI 时，ABI 有哪些限制？','异常路径中的日志、回滚和资源所有权如何组织？')
 'cpp/standard-concurrency' = @('它的生命周期、等待方式和析构行为应如何设计？','它与锁、等待或通知原语组合时怎样避免死锁？','它在异常、虚假唤醒或取消场景下的可见性语义如何保证？','它与其他标准并发组件组合时，哪些线程安全假设不能混淆？','如何用谓词、超时和退出标志构造可停止的等待？','内存序、同步边和数据竞争之间怎样建立因果关系？')
 'cpp/strings-time-files-streams' = @('所有权、视图失效和错误报告方式分别是什么？','它与 locale、编码和平台文件系统差异如何协调？','duration、time_point、system_clock 和 steady_clock 应如何选用？','iostream 状态位、缓冲和 streambuf 出错时怎样诊断？','如何避免字符串视图或迭代器指向已释放存储？','在跨平台输入输出中，异常与 error_code 应如何取舍？')
 'ue5/uobject-reflection-gc' = @('它与 UHT、反射元数据和生成代码的关系是什么？','它如何影响 UObject 生命周期、Outer 层级和 GC 可达性？','它与 UPROPERTY、TObjectPtr、TWeakObjectPtr 的边界如何划分？','编辑器、序列化和运行时访问时有哪些限制？','对象尚未注册或正在销毁时，哪些访问会失效？','如何排查反射字段未生成、未序列化或被 GC 回收的问题？')
 'ue5/actor-component-subsystem' = @('它在 Actor/Component 生命周期中的调用时机如何区分？','它与组件注册、根组件设置和世界上下文有什么顺序要求？','它和 Tick 依赖、PrimaryComponentTick 或 Subsystem 生命周期如何协调？','在 Spawn、PIE 和编辑器场景下有哪些行为差异？','所有者销毁或关卡切换时，相关回调按什么顺序触发？','如何避免在构造阶段访问尚未准备好的 World 或组件？')
 'ue5/delegate-interface-async' = @('它在存储、反射和解绑上的行为有什么差异？','绑定 UObject、裸指针、Lambda 或共享对象时有哪些生命周期风险？','它与 UINTERFACE、BlueprintNativeEvent 或 C++ 接口转换如何配合？','在异步任务、线程亲和性和取消竞态中如何安全使用？','回调执行期间增删绑定会不会改变当前通知序列？','如何把失败、取消和对象销毁传回调用方？')
 'ue5/replication-rpc-serialization' = @('它在属性复制链中的触发条件和时机是什么？','Server、Client 和 NetMulticast RPC 的权限与可靠性如何判断？','它对组件、子对象或自定义序列化的带宽与版本兼容有什么影响？','它如何服从服务器权威、所有权、预测和回滚边界？','重连、丢包和属性初始值到达顺序如何处理？','如何验证一个字段或 RPC 实际在哪些连接上生效？')
 'ue5/modules-plugins-buildcs' = @('Runtime 与 Editor 模块的依赖和 API 宏应如何安排？','Build.cs 公有/私有依赖、UHT 扫描和 LoadingPhase 会造成什么影响？','第三方库、热重载和模块初始化/卸载时有哪些 ABI 风险？','如何设计可独立编译、可打包发布的插件边界？','模块缺失或符号未导出时，应该从哪一层依赖开始排查？','运行时模块引用编辑器类型会带来哪些打包后果？')
 'windows/process-thread-sync' = @('它的生命周期、访问权限和关闭顺序如何管理？','它与等待、TLS 或线程创建 API 组合时有什么语义差异？','它的等待/唤醒规则、递归行为和跨进程能力如何比较？','它在取消、退出码和资源清理场景下怎样避免竞态与泄漏？','失败返回值、GetLastError 和超时状态应如何解读？','如何设计可审计的句柄所有权和线程退出协议？')
 'windows/winsock-protocol-iocp' = @('初始化、状态转换和失败路径如何处理？','阻塞/非阻塞、事件通知和重叠 I/O 的适用场景如何区分？','字节流、部分收发、半关闭和连接保活有哪些边界？','它和 IOCP、OVERLAPPED 生命周期、工作线程数量及取消错误如何协同？','超时、断线和对端关闭时，调用方应观察到哪些返回值？','如何保证缓冲区、完成键和 socket 生命周期不发生竞态？')
 'windows/dll-files-mmap-unicode-handles' = @('资源加载、符号导出和卸载时机如何影响 ABI 与线程安全？','文件 I/O 的成功路径、错误码、共享模式和句柄关闭顺序如何保证？','共享内存映射的生命周期、同步和权限边界如何定义？','字符编码、命名对象、句柄继承和伪句柄在跨进程场景有哪些陷阱？','跨 DLL 分配和释放内存时，运行库边界应如何处理？','如何排查卸载后回调、映射视图或句柄仍被使用的问题？')
}

$seen = @{}
foreach ($question in @($questions)) {
    if ($question.group -eq 'gof') {
        $question.title = ([string]$question.title).TrimEnd('?', '？') + '？'
        continue
    }
    $category = [string]$question.category
    $seeds = @($topicSeeds[$category])
    if (-not $seeds) { continue }
    $title = [string]$question.title
    $seed = $seeds | Sort-Object Length -Descending | Where-Object { $title.StartsWith($_, [StringComparison]::Ordinal) } | Select-Object -First 1
    if (-not $seed) { $seed = ($title -split '：', 2)[0].Trim() }
    $key = "$category|$seed"
    $n = if ($seen.ContainsKey($key)) { [int]$seen[$key] } else { 0 }
    $seen[$key] = $n + 1
    $choices = @($suffixes[$category])
    if (-not $choices) { continue }
    $question.title = "$seed：$($choices[$n % $choices.Count])"
}

$specificSuffixes = @{
    'ue5/uobject-reflection-gc' = @{
        'UObject 反射信息' = @('反射元数据由谁生成，运行时如何查询并避免依赖生成细节？', '反射信息如何影响序列化、编辑器工具和运行时类型判断？')
        'UCLASS 与 USTRUCT' = @('两者在 UHT 处理、默认构造和序列化能力上有哪些边界？', '选择 UCLASS 还是 USTRUCT 时，如何权衡 GC、复制和按值传递？')
        'UFUNCTION 与 UPROPERTY' = @('哪些 specifier 会改变 Blueprint 暴露、复制或编辑器可见性？', '声明变化后 UHT 生成代码和二进制接口会受到什么影响？')
        'UHT 头文件解析' = @('哪些 C++ 声明或 include 写法会让 UHT 解析失败，如何定位生成错误？', 'UHT 的解析边界如何影响模板、宏和跨模块反射声明？')
        'GENERATED_BODY' = @('生成代码插入位置和声明顺序有什么要求，常见编译错误如何判断？', '迁移或重命名反射类型时，GENERATED_BODY 与生成文件如何保持一致？')
        '属性编辑器权限' = @('EditAnywhere、VisibleInstanceOnly 等元数据如何决定编辑器中的修改权限？', '编辑器权限与运行时可写性、配置保存和复制属性是否是同一概念？')
        'Outer 层级' = @('Outer 如何参与对象归属、命名和 GC 可达性，什么时候不应随意复用？', '跨关卡或异步加载时 Outer 选择错误会造成哪些生命周期问题？')
        'NewObject' = @('NewObject 的 Outer、模板对象和对象标志参数如何影响初始化与 GC？', '运行时创建 UObject 时，何时应使用 NewObject、DuplicateObject 或构造子对象？')
        '对象标志' = @('RF_Transient、RF_Public 等对象标志分别影响哪些保存、复制和 GC 行为？', '调试 UObject 生命周期时，如何利用对象标志判断对象所处阶段？')
        'GC 可达性' = @('GC root、UPROPERTY 引用和容器引用如何共同决定对象是否可达？', '异步任务或非 UPROPERTY 指针持有 UObject 时，怎样避免被 GC 提前回收？')
        'TObjectPtr' = @('TObjectPtr 与裸 UObject 指针在 GC、编辑器和序列化场景下有什么差异？')
        'TWeakObjectPtr' = @('TWeakObjectPtr 如何表达弱引用，IsValid 与 Pin 的使用边界是什么？')
    }
    'ue5/actor-component-subsystem' = @{
        'Actor 构造函数' = @('构造、OnConstruction、BeginPlay 的调用时机分别是什么，哪些对象此时可用？', 'Actor 构造函数中创建默认子对象时，为什么不能依赖世界或运行时状态？')
        'OnConstruction' = @('编辑器修改属性时 OnConstruction 如何重复执行，如何避免副作用？', '运行时 SpawnActor 与编辑器放置 Actor 时，OnConstruction 的输入和调用顺序有何不同？')
        'BeginPlay' = @('BeginPlay 与组件注册、网络初始化的先后关系如何确认？')
        'SpawnActor 参数' = @('SpawnCollisionHandlingOverride、Owner、Instigator 等参数如何影响生成结果？')
        '组件注册' = @('运行时组件从创建到 RegisterComponent、Attach 和激活需要遵循什么顺序？')
        '根组件层级' = @('设置 RootComponent、AttachParent 和相对变换时，如何避免层级与变换错乱？')
        'CreateDefaultSubobject' = @('默认子对象与运行时 CreateComponent 的生命周期、编辑器显示和复制行为有什么区别？')
        '运行时 CreateComponent' = @('动态组件创建后何时注册、设置所有者并加入实例组件列表？')
        '组件 Tick 依赖' = @('TickFunction 的前置依赖如何声明，如何保证组件更新顺序稳定？')
        'PrimaryComponentTick' = @('如何通过 PrimaryComponentTick 控制 Tick、TickGroup 和运行时开关？')
        'WorldSubsystem' = @('WorldSubsystem 的实例范围和初始化时机如何与 UWorld 生命周期对应？')
        'GameInstanceSubsystem' = @('GameInstanceSubsystem 适合持有哪些跨关卡状态，何时销毁？')
        'Subsystem 初始化' = @('Subsystem 的 Initialize、Deinitialize 与依赖模块加载顺序如何协调？')
        'ChildActorComponent' = @('ChildActorComponent 的子 Actor 创建、重建和销毁时机有哪些陷阱？')
        '组件模板' = @('组件模板与实例属性如何区分，编辑器默认值何时复制到实例？')
        'Actor 销毁回调' = @('EndPlay、OnDestroyed 和析构函数各自负责什么，如何安排清理顺序？')
    }
    'ue5/delegate-interface-async' = @{
        '单播 Delegate' = @('单播 Delegate 的绑定对象、执行结果和解绑时机如何定义？')
        '多播 Delegate' = @('多播 Delegate 的调用顺序、广播期间修改订阅集合如何处理？')
        '动态 Delegate' = @('动态 Delegate 与反射、序列化和性能开销之间有什么取舍？')
        'AddUObject 与 AddRaw' = @('AddUObject、AddRaw 和 AddLambda 的生命周期风险分别是什么？')
        'Delegate 解绑' = @('Destroy、EndPlay 或对象移动后，怎样可靠地清理 Delegate 绑定？')
        'BlueprintNativeEvent' = @('BlueprintNativeEvent 的 C++ 基类实现、_Implementation 和覆盖规则如何配合？')
        'UINTERFACE' = @('UINTERFACE 与纯 C++ 接口的反射声明、实现类和调用方式有什么区别？')
        '接口指针转换' = @('如何在 UObject、UInterface 和实现类指针之间安全转换并检查有效性？')
        'AsyncTask' = @('AsyncTask 切换线程时如何保证 UObject 访问发生在正确的线程？')
        '线程池任务' = @('线程池任务的捕获对象、取消和完成回调如何避免竞态？')
        'TFuture 与 TPromise' = @('TFuture/TPromise 的结果传递、等待和异常路径如何设计？')
        'Latent Action' = @('Latent Action 的生命周期、世界上下文和取消条件如何管理？')
        '异步加载回调' = @('异步加载完成回调如何持有资源引用并处理加载失败或对象销毁？')
        '取消异步任务' = @('取消异步任务时，如何处理已排队回调、线程安全和资源释放？')
    }
    'ue5/replication-rpc-serialization' = @{
        'Actor 复制开关' = @('bReplicates、NetLoadOnClient 和网络相关标志如何决定 Actor 是否复制？')
        'ReplicatedUsing' = @('ReplicatedUsing 的 OnRep 回调何时触发，初始同步和服务端修改有何差异？')
        'DOREPLIFETIME' = @('DOREPLIFETIME 与条件复制如何声明属性，成员变化怎样进入复制布局？')
        '条件复制' = @('COND_OwnerOnly、COND_SkipOwner 等条件如何与连接所有权共同生效？')
        '服务器权威' = @('服务器权威模型下，客户端输入、验证和状态回写的边界如何划分？')
        'NetMulticast RPC' = @('NetMulticast RPC 的调用前提、可靠性和非相关客户端行为如何判断？')
        'Server RPC' = @('Server RPC 的拥有者检查、参数验证和可靠性选项如何设计？')
        'Client RPC' = @('Client RPC 如何定位目标连接，何时会因调用者不是拥有者而失效？')
        '可靠 RPC' = @('Reliable RPC 的顺序与重传保证是什么，为什么不能替代状态复制？')
        '组件复制' = @('组件复制开关、注册顺序和网络角色如何影响组件状态同步？')
        '子对象复制' = @('ReplicateSubobjects 与子对象生命周期、所有权和带宽如何协同？')
        'Fast Array Serializer' = @('Fast Array Serializer 的标记、增量变更和删除通知如何工作？')
        'NetDeltaSerialize' = @('NetDeltaSerialize 需要满足哪些 traits 和序列化契约，如何处理版本变化？')
        'FArchive 序列化' = @('FArchive 序列化与网络复制、SaveGame 序列化的边界如何区分？')
        'SaveGame 字段' = @('SaveGame 标记、Transient 属性和对象引用在保存恢复时如何取舍？')
        'USaveGame 版本' = @('USaveGame 数据升级时如何设计版本号、兼容读取和迁移路径？')
        '重连恢复' = @('客户端重连后，哪些状态依靠复制重建，哪些状态需要额外恢复协议？')
        'NetUpdateFrequency' = @('NetUpdateFrequency 与优先级、带宽预算和状态延迟之间如何权衡？')
    }
    'ue5/modules-plugins-buildcs' = @{
        'Runtime 模块' = @('Runtime 模块的公开 API、依赖和打包边界应如何定义？')
        'Editor 模块' = @('Editor 模块如何隔离编辑器依赖，避免运行时目标加载不必要的代码？')
        'Build.cs 公有依赖' = @('PublicDependencyModuleNames 与头文件暴露的依赖如何保持一致？')
        'Build.cs 私有依赖' = @('PrivateDependencyModuleNames 何时足够，哪些 include 会迫使依赖升级为公有？')
        'UHT 模块依赖' = @('UHT 扫描反射类型时，模块依赖和生成代码可见性需要满足什么条件？')
        '插件 LoadingPhase' = @('插件 LoadingPhase 与模块启动顺序、编辑器工具可用时机有什么关系？')
        '第三方库接入' = @('第三方库的库文件、头文件和运行时 DLL 如何在 Build.cs 中稳定接入？')
        '模块 API 宏' = @('模块 API 宏如何控制跨模块符号导出，哪些类型不应直接暴露？')
    }
    'windows/process-thread-sync' = @{
        'CreateProcess' = @('CreateProcess 的命令行、继承句柄、环境块和启动信息如何正确组合？')
        '进程和线程句柄' = @('进程/线程句柄的访问权限、等待语义和 CloseHandle 责任如何划分？')
        '句柄继承' = @('句柄继承的筛选方式和安全边界是什么，子进程如何确认继承结果？')
        'Job Object' = @('Job Object 如何限制进程组资源并接收终止通知？')
        'WaitForSingleObject' = @('WaitForSingleObject 的返回值、超时和等待对象类型有哪些陷阱？')
        'TLS' = @('线程局部存储的分配、访问和线程退出清理如何设计？')
        'CreateThread 与 _beginthreadex' = @('两种线程入口创建方式对 C 运行库初始化、参数和退出清理有何影响？')
        '线程优先级' = @('线程优先级与调度、饥饿和实时性之间如何权衡？')
        'APC' = @('用户态 APC 何时执行，alertable wait 和取消流程如何配合？')
        '临界区' = @('临界区初始化、递归进入、争用和删除时有哪些生命周期要求？')
        '互斥体' = @('命名互斥体与进程内锁的权限、递归和异常退出语义如何比较？')
        '信号量' = @('信号量计数、ReleaseSemaphore 和等待失败路径如何避免超发？')
        '事件' = @('手动重置与自动重置事件如何选择，如何避免丢失唤醒？')
        'SRWLock' = @('SRW lock 的共享/独占模式、递归限制和升级降级边界是什么？')
        '条件变量' = @('条件变量如何与 CRITICAL_SECTION 或 SRWLOCK 配合处理虚假唤醒？')
        'Interlocked' = @('Interlocked 原子操作的内存序和 ABA 风险如何评估？')
        'WaitOnAddress' = @('WaitOnAddress 的比较值、唤醒时机和与传统事件的取舍是什么？')
        'INIT_ONCE' = @('InitOnceExecuteOnce 如何保证一次性初始化，并处理初始化失败？')
        '死锁条件' = @('如何从互斥、持有并等待、不可剥夺和循环等待四个条件定位死锁？')
        '锁顺序' = @('多把锁的全局顺序如何约定，异常路径怎样保持同一顺序？')
        'TLS 清理' = @('线程退出时 TLS 回调、析构和 DLL 卸载的先后关系如何确认？')
        '进程终止回调' = @('进程正常退出、TerminateProcess 和 DLL 卸载时的清理保证有什么不同？')
    }
    'windows/winsock-protocol-iocp' = @{
        'WSAStartup' = @('WSAStartup/WSACleanup 的引用计数、版本协商和失败回滚如何处理？')
        '阻塞与非阻塞 socket' = @('阻塞、非阻塞和重叠 socket 的错误码与线程模型如何区分？')
        'bind、listen、accept' = @('监听 socket 的地址绑定、backlog 和 accept 失败路径如何设计？')
        'connect 超时' = @('非阻塞 connect 如何检测完成、超时并安全关闭 socket？')
        'TCP 字节流' = @('TCP 不保留消息边界时，应用层如何处理拆包、粘包和半关闭？')
        '套接字复用' = @('SO_REUSEADDR 等复用选项在 Windows 上的语义和端口冲突风险是什么？')
        'select 与 WSAPoll' = @('select 与 WSAPoll 的句柄集合、容量限制和可扩展性如何比较？')
        'WSAEventSelect' = @('WSAEventSelect 的网络事件位、重置方式和非阻塞要求是什么？')
        '部分 send' = @('send 返回小于请求长度时，发送缓冲区和重试策略如何设计？')
        'recv 返回值' = @('recv 返回 0、SOCKET_ERROR 和正数分别表示什么状态？')
        'shutdown 半关闭' = @('shutdown 的读写方向与 FIN 交互如何表达半关闭协议？')
        'SO_KEEPALIVE' = @('SO_KEEPALIVE 与应用层心跳、探测间隔和断线检测如何取舍？')
        'UDP 报文' = @('UDP 报文边界、丢包、乱序和接收缓冲区限制如何处理？')
        'IPv4 与 IPv6' = @('双栈监听、地址解析和 IPv4-mapped IPv6 地址有哪些兼容问题？')
        'getaddrinfo' = @('getaddrinfo 的 hints、地址遍历和异步解析失败如何处理？')
        'Overlapped I/O' = @('OVERLAPPED 结构、缓冲区和完成通知的生命周期如何保证？')
        'IOCP 完成键' = @('完成键如何关联连接上下文，工作线程如何区分不同 I/O 类型？')
        'GetQueuedCompletionStatus' = @('GetQueuedCompletionStatus 的返回值、ERROR_OPERATION_ABORTED 和退出哨兵如何判断？')
        '多个 recv 请求' = @('同一 socket 排队多个 recv 时，缓冲区所有权和完成顺序如何管理？')
        '取消套接字 I/O' = @('CancelIoEx、closesocket 与未完成 Winsock I/O 的竞态如何处理？')
        'TCP_NODELAY' = @('TCP_NODELAY 对小包延迟、吞吐和应用层批量发送有什么影响？')
        'TLS 会话' = @('TLS 握手、证书验证和底层 socket 生命周期如何分层管理？')
    }
    'windows/dll-files-mmap-unicode-handles' = @{
        'LoadLibraryEx' = @('LoadLibraryEx 的搜索路径、标志和模块引用计数如何控制？')
        'GetProcAddress' = @('GetProcAddress 的名称修饰、序号导出和函数指针签名如何保证 ABI 一致？')
        'DLLMain' = @('DllMain 中哪些操作受 loader lock 限制，初始化逻辑应如何拆分？')
        '卸载 DLL' = @('FreeLibrary 与线程回调、静态对象析构和仍在执行的函数如何协调？')
        'CreateFile 共享模式' = @('CreateFile 的访问权、共享模式、创建选项和安全属性如何组合？')
        '句柄继承' = @('跨进程传递句柄时，继承标志、DuplicateHandle 和权限如何选择？')
        'DuplicateHandle' = @('DuplicateHandle 的源/目标进程权限和关闭责任如何划分？')
        'ReadFile 与 WriteFile' = @('同步与重叠文件 I/O 的返回值、偏移和缓冲区生命周期如何处理？')
        'FlushFileBuffers' = @('FlushFileBuffers 保证到哪一层持久性，调用频率如何权衡？')
        'CreateFileMapping' = @('CreateFileMapping 的保护属性、映射大小和命名冲突如何设计？')
        'MapViewOfFile' = @('MapViewOfFile 的偏移对齐、视图权限和 UnmapViewOfFile 顺序是什么？')
        '跨进程映射' = @('跨进程共享内存的同步、版本布局和异常退出清理如何保证？')
        'UTF-16 与 UTF-8' = @('Windows 宽字符 API 与 UTF-8 转换时，长度、错误和不可表示字符如何处理？')
        '命名对象 Unicode' = @('命名内核对象的 Unicode、命名空间和权限边界有哪些陷阱？')
        'CloseHandle' = @('CloseHandle 的幂等性、伪句柄和重复关闭行为应如何避免？')
        '伪句柄' = @('GetCurrentProcess/GetCurrentThread 伪句柄何时需要 DuplicateHandle 才能跨线程或进程使用？')
    }
    'cpp/smart-pointers-allocators' = @{
        'unique_ptr 所有权' = @('如何用 unique_ptr 表达独占所有权、数组所有权和自定义删除器？', 'unique_ptr 移动、释放和异常路径的所有权转移如何验证？', '跨 DLL 或 C API 边界返回 unique_ptr 时，删除器和分配器如何匹配？')
        'shared_ptr 控制块' = @('shared_ptr 控制块保存哪些状态，引用计数的线程安全边界是什么？', 'shared_ptr 的拷贝、移动和别名构造会怎样改变控制块与对象寿命？', '如何排查多个 shared_ptr 控制块导致的重复释放问题？')
        'weak_ptr 观察' = @('weak_ptr::lock 的成功条件和过期观察语义是什么？', 'weak_ptr 如何打破 shared_ptr 循环引用，回调中怎样避免竞态？', '把 weak_ptr 用作缓存或观察者句柄时，失效处理应如何设计？')
        'make_shared' = @('make_shared 的单次分配、异常安全和对象可见性有什么影响？', '构造函数私有、数组对象或自定义删除器场景为何不能直接套用 make_shared？', 'make_shared 与显式 new shared_ptr 在控制块布局和生命周期上如何取舍？')
        '别名构造' = @('shared_ptr 别名构造如何保持被管理对象存活，却让 get() 指向子对象？', '别名构造与容器元素、成员子对象结合时，哪些指针会悬空？', '如何区分别名构造的观察指针与控制块实际负责释放的对象？')
        'enable_shared_from_this' = @('enable_shared_from_this 何时初始化 weak_this，为什么栈对象上调用会出错？', '从成员函数返回 shared_from_this 时，如何避免对象尚未被 shared_ptr 管理？', '继承层次、多重控制块和拷贝对象场景下，enable_shared_from_this 的边界是什么？')
    }
    'cpp/value-categories-move-forwarding' = @{
        '左值与右值' = @('左值、纯右值和将亡值如何影响重载选择与引用绑定？', '表达式加括号、返回值和成员访问会怎样改变值类别？', '如何用重载探针或 decltype 判断一个表达式的值类别？')
        '引用折叠' = @('引用折叠的四条规则如何在模板实例化中生效？', '引用折叠与 const、volatile 组合时，最终参数类型如何推导？', '设计转发接口时，引用折叠怎样避免意外复制？')
        '转发引用' = @('转发引用与普通右值引用的识别条件分别是什么？', '转发引用接收数组、函数和 const 对象时，模板参数如何变化？', '转发引用配合 std::forward 时，如何保持调用方原始值类别？')
        'std::move' = @('std::move 只改变值类别而不移动资源时，调用方应如何理解？', '对 const 对象使用 std::move 为什么通常仍会触发拷贝？', '连续两次 std::move 或移动后再次使用对象时，接口契约如何表达？')
        'std::forward' = @('std::forward 的模板参数从哪里来，错误指定参数会造成什么后果？', '完美转发到重载、初始化列表或成员函数时，如何避免错误匹配？', 'std::forward 与转发引用之外的参数组合是否仍然成立？')
        '移动构造 noexcept' = @('移动构造标记为 noexcept 时，容器扩容和异常保证会发生什么变化？', '移动构造抛异常时，源对象与目标对象分别允许处于什么状态？', '如何用 noexcept 条件影响泛型算法对拷贝或移动的选择？')
        '拷贝消除' = @('C++17 强制拷贝消除适用于哪些纯右值初始化场景？', 'NRVO 未发生时，编译器会按什么顺序尝试移动和拷贝？', '显式 std::move 为什么可能阻止 NRVO，如何在接口中取舍？')
        'NRVO' = @('具名返回值优化的触发条件和不保证发生的边界是什么？', '多个返回分支返回不同局部对象时，NRVO 与移动构造如何交互？')
    }
    'cpp/templates-sfinae-traits-constexpr' = @{
        '模板参数种类' = @('类型、非类型和模板模板参数分别适合表达什么约束？', '模板参数默认值、包参数和参数顺序如何影响调用端写法？', '跨 C++11 到 C++17 时，模板参数允许的常量表达式范围有什么变化？')
        '函数模板推导' = @('函数模板推导遇到数组、函数、cv/ref 和初始化列表时会怎样退化？', '显式模板实参、默认实参和重载候选如何共同决定最终实例？', '推导失败时如何区分参数不匹配、约束失败和重载歧义？')
        '非类型模板参数' = @('非类型模板参数的类型限制和链接身份如何影响实例化？', '指针、引用和整型非类型参数在 C++17 中有哪些合法形式？', '非类型模板参数参与重载或偏特化时，如何避免产生意外的不同类型？')
        '模板默认参数' = @('类模板和函数模板的默认参数声明位置有哪些限制？', '默认模板参数与前置声明、偏特化和模块头文件如何保持一致？', '调用端省略默认参数后，重载解析还能看到哪些候选？')
        '偏特化' = @('类模板偏特化如何匹配指针、数组或参数包等类型族？', '偏特化的匹配优先级与主模板、其他偏特化之间如何判定？', '函数模板不能偏特化时，通常应改用哪些替代技术？')
        '全特化' = @('显式全特化的声明、定义和命名空间位置有什么要求？', '全特化与显式实例化如何避免跨翻译单元重复定义？', '为某个类型全特化后，后续重载和 ADL 行为会发生什么变化？')
        'SFINAE' = @('SFINAE 发生在替换的哪一阶段，哪些错误不会被它吞掉？', 'SFINAE 重载与普通重载并存时，如何让诊断保持可读？', 'C++17 中 if constexpr 与 SFINAE 在接口约束上的取舍是什么？')
        'enable_if' = @('enable_if 放在返回类型、模板参数或函数参数中各有什么副作用？', 'enable_if 重载遇到默认参数和继承转换时如何避免歧义？', '如何把 enable_if 约束迁移为更清晰的 traits 或 if constexpr？')
        'void_t' = @('void_t 检测惯用法如何探测成员类型、表达式和运算符？', 'void_t 偏特化的失败位置与别名模板实例化顺序是什么？', '检测到成员后，如何继续给出稳定的 fallback 类型？')
        '检测惯用法' = @('检测惯用法如何判断一个类型是否支持 begin、size 或调用操作？', '检测表达式时，decltype、declval 和访问控制会带来哪些边界？', '检测结果如何组合成不泄漏实现细节的泛型接口？')
        'if constexpr' = @('if constexpr 丢弃语句的规则如何避免无关分支实例化？', 'if constexpr 与重载、lambda 和局部变量作用域结合时有哪些陷阱？', '何时应使用 if constexpr，何时仍需要偏特化或 SFINAE？')
        'type_traits' = @('type_traits 查询的是类型属性还是表达式性质，如何选择对应 trait？', '自定义 trait 的主模板、偏特化和变量模板应如何组织？')
    }
    'cpp/containers-iterators' = @{
        'vector 扩容' = @('vector 扩容时哪些迭代器、引用和指针会失效？', 'reserve、resize 和 push_back 对容量、构造次数和异常保证有什么区别？', '元素类型不可 noexcept 移动时，vector 扩容如何选择拷贝或移动？')
        'deque 失效规则' = @('deque 的分段存储如何影响插入、删除后的迭代器和引用有效性？', 'deque 首尾操作与中间插入的复杂度、失效规则有什么差异？', '需要稳定引用又要双端操作时，deque 的边界应如何评估？')
        'list splice' = @('list::splice 如何转移节点而不移动元素，迭代器有效性怎样保持？', 'splice 的来源容器、分配器和自拼接边界有哪些要求？', 'list 与 vector 在删除、局部性和节点开销上的取舍如何判断？')
        'forward_list' = @('forward_list 为什么提供 before_begin，erase_after 的使用契约是什么？', 'forward_list::splice_after 转移节点时，前驱迭代器如何管理？', '单向链表没有 size 时，接口设计和遍历成本如何权衡？')
        'array' = @('array 的固定大小、聚合初始化和 data() 语义与原生数组有何不同？', 'array 的迭代器、零长度实例和边界访问应如何处理？', '需要编译期大小和连续存储时，array 与 vector 的接口取舍是什么？')
        'map 比较器' = @('map 比较器必须满足怎样的严格弱序，等价键如何定义？', '透明比较器与 heterogeneous lookup 如何避免临时键构造？', '修改 map 键、提取 node_handle 和异常路径时，有序性不变量如何保持？')
        'unordered_map 桶' = @('load_factor、max_load_factor 和 rehash 如何共同决定桶数量？', 'unordered_map rehash 后哪些迭代器、引用和指针会失效？', 'reserve 与 rehash 的区别是什么，如何预估高并发插入的内存成本？')
        'Hash 与 KeyEqual' = @('自定义 Hash 与 KeyEqual 必须满足什么等价关系？', '哈希函数质量、冲突处理和异常保证如何影响 unordered_map 行为？', '键对象可变时，为什么会破坏哈希容器的不变量？')
        'string 小字符串优化' = @('标准是否保证 SSO，代码如何避免依赖具体实现的布局？', 'string 扩容或移动后，指针、引用和 string_view 的有效性如何判断？', '跨 ABI 边界传递 string 时，SSO 和分配器差异会带来什么风险？')
        'string_view' = @('string_view 不拥有存储时，哪些返回值和异步回调会产生悬空视图？', 'substr、remove_prefix 和 data/size 组合时，调用方应承担哪些边界？', '接口返回 string_view 还是 string，如何表达所有权和生命周期？')
        '迭代器类别' = @('输入、前向、双向和随机访问迭代器分别承诺哪些操作？', '迭代器类别如何影响标准库组件的复杂度和可用算法接口？', 'C++17 中 iterator_traits、标签分派和自定义迭代器应如何配合？')
        'const_iterator' = @('iterator 到 const_iterator 的转换和反向转换为什么不对称？', 'cbegin、begin 和容器 const 性如何影响调用端的可写权限？')
    }
    'cpp/standard-concurrency' = @{
        'std::thread 生命周期' = @('std::thread 析构时仍可 joinable 会发生什么，所有权如何转移？', '线程函数捕获对象、启动失败和退出清理的生命周期如何保证？', '移动 std::thread 后，原对象和新对象分别处于什么状态？')
        'join 与 detach' = @('join 与 detach 对进程退出、资源回收和异常传播的影响有什么不同？', '如何为线程设计可取消的 join 流程，避免 detach 后悬空捕获？', '一个线程只能 join 一次时，接口如何表达调用责任？')
        'mutex 类型' = @('mutex、recursive_mutex、timed_mutex 的适用边界和递归语义是什么？', '互斥量销毁或移动时有哪些前置条件，如何表达锁的所有权？', '跨线程共享 mutex 时，异常路径怎样保证不遗留锁？')
        'lock_guard' = @('lock_guard 的作用域与异常安全保证如何利用？', 'lock_guard 不能提前解锁时，接口设计应如何安排临界区边界？', '采用 lock_guard 还是 unique_lock，取决于哪些操作需求？')
        'unique_lock' = @('unique_lock 的 defer_lock、adopt_lock 和 try_lock 状态如何区分？', 'unique_lock 与 condition_variable 等待配合时，锁的所有权如何变化？', '移动 unique_lock 后谁负责解锁，异常路径如何验证？')
        'scoped_lock' = @('scoped_lock 如何一次获取多把锁并避免固定顺序导致的死锁？', 'scoped_lock 与 lock_guard、unique_lock 混用时有哪些所有权边界？', '空锁列表和重复锁对象传给 scoped_lock 时应如何处理？')
        'std::lock' = @('std::lock 的死锁避免保证是什么，调用方何时需要 adopt_lock？', 'std::lock 获取多把锁失败或异常时，已获得的锁如何处理？', '如何把 std::lock 与不同类型的锁包装组合起来？')
        'condition_variable' = @('condition_variable 的等待谓词为什么必须放在循环中？', 'condition_variable 的 notify 时机、锁释放顺序和丢失唤醒如何验证？', 'wait_for、wait_until 超时后，谓词和锁的状态分别是什么？')
        '虚假唤醒' = @('虚假唤醒会怎样破坏一次性 if 判断，正确谓词应如何书写？', '多个消费者遇到虚假唤醒时，通知次数和共享状态如何协调？', '如何用测试稳定复现并诊断虚假唤醒相关竞态？')
        'notify_one 与 notify_all' = @('notify_one 与 notify_all 如何选择，是否持锁通知会影响吞吐？', '多个条件或多个消费者共享通知源时，怎样避免唤醒错误对象？', '通知发生在等待者入队之前时，为什么仍需用谓词保护状态？')
        'future 与 promise' = @('future/promise 共享状态如何传递值、异常和 broken_promise？', 'future::get 只能调用一次时，多个消费者应使用什么替代方案？', 'promise 设置值与等待线程销毁并发发生时，生命周期如何保证？')
        'async 策略' = @('std::async 的 async、deferred 策略如何影响线程创建和析构阻塞？', 'future 临时对象析构可能等待任务时，调用端如何避免隐式串行化？')
    }
    'cpp/strings-time-files-streams' = @{
        'basic_string traits' = @('char_traits、Allocator 和字符类型如何共同决定 basic_string 的行为？', '自定义 traits 或 allocator 时，哪些接口必须满足一致性契约？', 'basic_string 与 string_view、C 字符串互操作时，长度和所有权如何表达？')
        '字符串失效规则' = @('basic_string 修改或扩容后，指针、引用和 string_view 的失效边界是什么？', '返回临时 string 的视图、substr 和 data() 组合时如何避免悬空？', '跨线程只读共享字符串时，哪些操作会意外触发写入或重分配？')
        'locale' = @('locale、facet 和 imbue 如何影响格式化、比较和字符分类？', '全局 locale 与线程局部 locale 的变化会怎样影响库代码？', '跨平台处理数字和文本时，locale 与显式编码策略如何取舍？')
        '正则表达式' = @('regex_match、regex_search 和 regex_replace 的匹配范围有什么区别？', '正则迭代器、异常和临时字符串生命周期如何共同影响结果？', '需要可预测性能时，std::regex 与手写解析的边界如何判断？')
        'ios 状态位' = @('rdstate、eofbit、failbit 和 badbit 分别表示什么，clear 如何恢复流？', 'exceptions() 设置后，流错误何时转为异常，析构阶段如何处理？', '格式化失败和底层 I/O 失败怎样通过 iostream 状态区分？')
        'streambuf' = @('streambuf 的缓冲区、underflow/overflow 和 putback 契约如何协同？', '自定义 streambuf 时，seek、同步和所有权由谁负责？', '文件流、字符串流与底层 streambuf 的生命周期如何安排？')
    }
}
$specificOccurrences = @{}
foreach ($question in @($questions)) {
    $category = [string]$question.category
    if (-not $specificSuffixes.ContainsKey($category)) { continue }
    $title = [string]$question.title
    $colonPosition = $title.IndexOf('：', [StringComparison]::Ordinal)
    if ($colonPosition -lt 0) { continue }
    $topic = $title.Substring(0, $colonPosition).Trim()
    $categoryMap = $specificSuffixes[$category]
    if (-not $categoryMap.ContainsKey($topic)) { continue }
    $key = "$category|$topic"
    $occurrence = if ($specificOccurrences.ContainsKey($key)) { [int]$specificOccurrences[$key] } else { 0 }
    $specificOccurrences[$key] = $occurrence + 1
    $choices = @($categoryMap[$topic])
    $question.title = "$topic：$($choices[[Math]::Min($occurrence, $choices.Count - 1)])"
}

$json = $questions | ConvertTo-Json -Depth 12
[IO.File]::WriteAllText($resolvedPath, "window.CPP_INTERVIEW_QUESTIONS = `r`n$json`r`n;`r`n", (New-Object Text.UTF8Encoding($false)))
Write-Output "Rewrote $($questions.Count) titles"
