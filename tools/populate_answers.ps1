[CmdletBinding()]
param(
    [string]$DataPath
)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($DataPath)) {
    $DataPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..\questions.js'
}

function Get-Topic([string]$Title) {
    return [string](($Title -split '：', 2)[0])
}

$gofAnswers = @{
    'Abstract Factory' = @(
        '抽象工厂提供创建一族相互匹配产品的接口，客户端只依赖抽象产品，因此可以整体替换产品族。',
        '产品族的选择应放在组合根或配置层，业务对象只拿到抽象工厂；切换族时不把具体类型判断扩散到客户端。',
        '把抽象工厂作为依赖注入，客户端依赖稳定的产品接口；测试时可注入另一套工厂而不改业务代码。'
    )
    'Builder' = @(
        'Builder 将复杂对象的构造步骤与最终表示分离，调用者按步骤组装，适合可选参数多且构造顺序有约束的对象。',
        '可复用 Builder 必须在每次 Build 后重置或创建新状态，不能让上一次构造的可变字段泄漏到下一次结果。',
        '参数少且约束简单时命名构造函数更直接；步骤多、可选组合多或需要多种表示时再采用 Builder。'
    )
    'Factory Method' = @(
        'Factory Method 在基类定义创建操作，把具体产品的决定延迟给派生类，同时让业务流程依赖抽象产品。',
        '扩展点应只暴露抽象产品和受控的创建钩子，避免派生类修改核心流程或把具体类型泄漏给调用方。',
        '简单工厂集中一个条件分支创建对象；Factory Method 用多态延迟创建，更适合扩展和注入测试替身。'
    )
    'Prototype' = @(
        'Prototype 通过复制已有实例创建对象；复制契约必须明确值字段、拥有资源和共享资源分别采用浅拷贝还是深拷贝。',
        '原型注册表用稳定键保存原型并返回 Clone 结果，要处理键冲突、缺失键和原型生命周期，不能把注册表当全局裸指针表。',
        '与值语义结合时应让拷贝构造或 Clone 明确独立所有权；内部共享的可变资源必须有同步或复制策略。'
    )
    'Singleton' = @(
        'C++11 起函数内静态对象的初始化是线程安全的，通常可用它实现惰性初始化的单例，但仍要明确唯一性和访问边界。',
        '静态对象之间的析构顺序跨翻译单元不稳定，单例不要在析构阶段依赖另一个静态对象；必要时采用受控生命周期。',
        'Singleton 把状态变成全局依赖，测试替换和并发隔离都变难；能用依赖注入表达的服务通常不应强行做成单例。'
    )
    'Adapter' = @(
        'Adapter 把已有接口转换为客户端需要的接口，适配器持有被适配对象并只承担协议转换，不改变原对象职责。',
        '对象适配器通过组合更灵活；类适配器依赖多重继承或继承关系，只有在语言和类型层次允许时才考虑。',
        '适配器要明确所有权、异常和错误码的转换边界，通常不接管被适配对象的生命周期，除非接口契约明确转移所有权。'
    )
    'Bridge' = @(
        'Bridge 将抽象层与实现层拆成两条可独立变化的层次，通过组合持有实现者，避免平台变化导致抽象类层次爆炸。',
        '实现对象的拥有和替换由抽象层的生命周期契约决定，通常用接口加智能指针表达所有权和可替换性。',
        '把平台实现放在实现层和私有头文件中，抽象层只依赖稳定接口，可减少跨平台代码和头文件耦合。'
    )
    'Composite' = @(
        'Composite 让叶子和组合节点实现同一组件接口，客户端可以统一处理单个对象和对象树。',
        '遍历子节点时要先定义节点所有权和删除时机，避免在回调或遍历期间销毁当前节点造成悬空访问。',
        '透明接口把子节点管理操作放进统一接口，使用方便但叶子要处理无意义操作；安全接口更精确但客户端需要区分节点类型。'
    )
    'Decorator' = @(
        'Decorator 通过包装同一接口在运行时叠加职责，不修改原类，也不要求为每种组合建立新的派生类。',
        '多层装饰器应按栈式所有权销毁；异常要沿同一调用链传播，资源清理交给 RAII，不能在某一层吞掉失败。',
        'Decorator 适合运行时组合，继承适合固定的类型差异；前者可动态增删职责，后者更容易表达静态不变量。'
    )
    'Facade' = @(
        'Facade 为多个子系统提供一个稳定的高层入口，隐藏协作顺序和内部类型，降低调用方的认知和编译耦合。',
        'Facade 可以协调子系统，但是否拥有对象要看职责；共享基础设施通常由外部注入，避免 Facade 变成隐式全局容器。',
        '把 Facade 放在模块边界并只暴露前置声明或接口，可让调用方不包含子系统实现头文件，减少重编译。'
    )
    'Flyweight' = @(
        'Flyweight 把可共享的内在状态与每次使用的外在状态分开，用共享对象降低重复内存，但共享状态应尽量不可变。',
        'Flyweight 工厂以规范化键管理共享实例，键、缓存所有权和淘汰策略必须一致，不能让调用者保存失效裸指针。',
        '共享不可变数据可并发只读；若内在状态会变化，就必须同步或复制，否则共享会把一次修改传播到所有使用者。'
    )
    'Proxy' = @(
        'Proxy 提供与真实对象相同的接口，在访问前后增加权限、远程调用、缓存或日志控制，而不改变客户端协议。',
        '虚拟 Proxy 延迟创建真实资源；创建失败应通过明确的错误返回、异常或状态对象报告，不能返回看似有效的空对象。',
        'Adapter 改变接口，Decorator 叠加职责，Proxy 控制对真实对象的访问；判断意图比看起来是否都在“包一层”更重要。'
    )
    'Chain of Responsibility' = @(
        '责任链把请求沿处理者链传递，每个处理者决定处理、继续传递或拒绝，发送者不需要知道具体接收者。',
        '接口应明确三种结果并约定是否允许多个处理者处理；不能用“返回空”同时表示已处理和未处理。',
        '动态增删处理者要由链的所有者维护顺序和生命周期，修改链时避免并发遍历看到半更新结构。'
    )
    'Command' = @(
        'Command 把一次操作及其接收者参数封装成对象，因此可以排队、记录、延迟执行或统一撤销。',
        '可撤销 Command 至少保存恢复所需的旧状态或反向操作；只保存“操作名称”无法可靠撤销副作用。',
        '宏命令执行多个子命令时要定义失败策略：回滚已完成步骤、记录部分成功，或明确保持不可回滚状态。'
    )
    'Interpreter' = @(
        'Interpreter 用类层次表示小型语法的非终结符和终结符，每个表达式在上下文中解释自身。',
        'Context 保存解释期间共享的变量、环境或输入位置；它不应偷偷承担解析器和业务服务的生命周期。',
        '语法增长后通常让解析器负责词法和语法分析、解释器负责执行语义，避免用大量解释节点承担复杂解析。'
    )
    'Iterator' = @(
        'Iterator 将集合内部表示隐藏在访问协议后，客户端通过统一的 begin/end 或迭代器接口遍历。',
        '自定义 Iterator 必须说明失效条件、比较规则和底层所有权；迭代器通常不拥有容器，容器销毁后迭代器立即失效。',
        '范围 for 需要 begin/end、迭代器的递增、解引用和可比较语义；数组式集合还要保证返回的迭代器满足相应类别。'
    )
    'Mediator' = @(
        'Mediator 把同事对象之间的网状协作集中到中介者，组件只与中介者通信，减少彼此直接依赖。',
        '中介者膨胀说明协作边界过大，应按用例或子域拆分多个中介者，而不是继续堆叠条件分支。',
        '中介者转发失败要用返回值、错误对象或异常明确传回调用者，不能静默吞掉某个同事对象的失败。'
    )
    'Memento' = @(
        'Memento 在不暴露对象内部表示的前提下保存快照，由发起者创建和恢复，管理者只负责保存。',
        '快照的所有权和版本应由管理者或发起者明确，恢复前检查版本，避免把旧布局直接解释成新状态。',
        '快照数量大时应限制历史深度、做增量快照或压缩，并明确淘汰策略，不能无限复制完整状态。'
    )
    'Observer' = @(
        'Observer 建立一对多通知关系，主题只依赖观察者接口；注册和取消订阅必须与观察者生命周期绑定。',
        '通知期间修改订阅集合应遍历稳定快照或延迟修改，避免迭代器失效和回调重入破坏容器。',
        '异步通知要约定顺序、线程和失败隔离；通常复制事件数据并让单个观察者失败不阻塞整个广播。'
    )
    'State' = @(
        'State 把状态相关行为拆成状态对象，让上下文委托当前状态，替代不断增长的大型条件分支。',
        '共享 State 对象只能保存不可变行为；与请求或上下文有关的瞬时数据应放在 Context 或调用参数中。',
        '状态切换失败时应恢复上下文状态和外部副作用，若无法回滚就把操作设计成可重试或显式失败。'
    )
    'Strategy' = @(
        'Strategy 把可替换算法或业务策略封装为稳定接口，Context 组合一个策略并在运行时选择。',
        '运行时选择策略时由组合根或工厂管理依赖和生命周期，Context 不应自行创建具体策略或拥有全局注册表。',
        'Strategy 通过组合在运行时替换行为；Template Method 通过继承固定骨架并覆盖步骤，扩展时机不同。'
    )
    'Template Method' = @(
        'Template Method 在基类固定流程骨架，把可变步骤交给派生类或钩子实现，保证整体顺序不被改变。',
        '钩子应有清晰默认行为和异常契约；基类负责资源和流程收尾，派生类不能破坏不变量。',
        'Template Method 适合同一流程的静态变体，Strategy 适合运行时替换；测试边界也分别落在派生步骤和独立策略上。'
    )
    'Visitor' = @(
        'Visitor 把操作从元素层次移出，新增操作无需修改每个元素，但需要元素提供 accept 接口。',
        '双重分派让元素类型和访问者类型共同决定 visit 重载，解决单次虚调用无法同时依赖两种动态类型的限制。',
        '元素类型频繁变化时 Visitor 的每次新增元素都要修改所有 Visitor，维护成本可能超过新增操作带来的收益。'
    )
}

$crossAnswers = @{
    '350' = 'Abstract Factory 负责选择一族一致产品，Builder 负责按步骤组装一个复杂产品；前者解决产品族替换，后者解决构造过程组织。'
    '351' = 'Factory Method 适合把创建点延迟给派生类，Prototype 适合已有实例复制成本更低或类型运行时决定的场景。'
    '352' = 'Facade 提供窄入口，Singleton 只解决唯一访问点；组合时让 Facade 由外部注入服务，避免 Singleton 把整个子系统变成全局状态。'
    '353' = 'Adapter 改变接口，Bridge 拆分抽象与实现两个变化轴，Facade 提供子系统的高层入口；判断客户端意图即可区分三者。'
    '354' = 'Composite 提供统一树遍历，Visitor 把操作外置；通常由 Visitor 访问 Composite 节点并递归子节点，同时保持元素接口稳定。'
    '355' = 'Decorator 重点是叠加职责，Proxy 重点是控制访问，二者都保持接口不变；看包装对象是否代表真实对象及访问策略即可判断。'
    '356' = 'Command 保存待执行操作，Memento 保存执行前快照；撤销时先恢复快照或执行反向 Command，并明确部分失败策略。'
    '357' = 'Mediator 负责限定协作范围，Observer 负责一对多通知；让主题只向中介者发布领域事件，避免观察者直接形成广播网。'
    '358' = 'State 表示上下文状态导致的行为变化，Strategy 表示调用方选择的可替换策略；前者通常由 Context 驱动切换，后者由组合根选择。'
    '359' = 'Interpreter 表达语法语义，责任链表达处理者逐级接管；可先由解释器生成结构化请求，再交给责任链按层级处理。'
    '360' = 'Template Method 固定流程，Factory Method 把其中的创建步骤交给派生类；创建点延迟但流程骨架仍由基类掌控。'
}

$ueAnswers = @{
    'UObject 反射信息' = 'UHT 在构建阶段扫描 UCLASS、USTRUCT、UFUNCTION 等声明并生成反射代码；运行时通过 UClass、FProperty、UFunction 查询，不应依赖生成文件内部细节。'
    'UCLASS 与 USTRUCT' = 'UCLASS 属于 UObject 体系，支持 GC、反射和对象引用；USTRUCT 更像可按值传递的数据类型，可反射和序列化但不由 GC 单独管理。'
    'UFUNCTION 与 UPROPERTY' = 'specifier 决定 Blueprint 暴露、编辑器可见性、复制和序列化行为；它们是引擎工具的元数据，不等同于 C++ 的访问控制或线程安全。'
    'UHT 头文件解析' = 'UHT 只支持规定的反射语法和可解析声明；遇到复杂模板、宏展开或 include 顺序问题，应先看 UHT 生成日志和最早的解析错误。'
    'GENERATED_BODY' = 'GENERATED_BODY 必须放在反射类型声明的合适位置并保持声明顺序稳定；迁移或重命名后要重新生成代码，优先排查宏位置和模块可见性。'
    '属性编辑器权限' = 'EditAnywhere、VisibleInstanceOnly 等控制编辑器能否修改属性；编辑器权限、运行时可写性、配置保存和网络复制是四个独立概念。'
    'Outer 层级' = 'Outer 表达 UObject 的归属和命名层级，也参与部分 GC 可达性；跨关卡或异步对象不能随意复用短生命周期 Outer，应选择明确的持有者。'
    'NewObject' = 'NewObject 用 Outer、模板和对象标志创建 UObject；运行时普通对象用 NewObject，复制已有对象用 DuplicateObject，默认子对象应在构造函数中创建。'
    '对象标志' = 'RF_Transient 等标志影响保存、复制和编辑器行为；调试时把标志当作状态线索，不能用单个标志替代 UPROPERTY 引用和生命周期判断。'
    'GC 可达性' = 'GC 从 root 遍历 UPROPERTY 等可追踪引用；裸指针、普通容器或异步任务不会自动保持 UObject，必须使用 UPROPERTY、TObjectPtr 或显式 root 方案。'
    'TObjectPtr' = 'TObjectPtr 是引擎可追踪的 UObject 指针，便于 GC、编辑器和序列化；裸指针只表达地址，不能单独保证对象存活。'
    'TWeakObjectPtr' = 'TWeakObjectPtr 不拥有对象，IsValid 用于检查当前有效性，Pin 用于在短暂使用期间取得安全的强引用；对象销毁后弱引用会失效。'
    'Actor 构造函数' = '构造函数主要创建默认子对象，不能依赖 World、运行时玩家或资产状态；OnConstruction 处理实例化后的属性构造，BeginPlay 才进入运行时。'
    'OnConstruction' = 'OnConstruction 会在编辑器属性变化和运行时生成后执行，逻辑必须可重复且可撤销，不能把一次性运行时副作用放进去。'
    'BeginPlay' = 'BeginPlay 在 Actor 和组件完成注册、世界开始运行后调用；需要网络角色或运行时世界状态的初始化应放在这里并确认调用顺序。'
    'SpawnActor 参数' = '生成碰撞处理决定重叠、阻挡时是否生成，Owner 表达归属和 RPC 权限，Instigator 表达发起者；三者不是同一个概念。'
    '组件注册' = '动态组件通常先创建并设置 Outer/所有者，再 RegisterComponent、Attach 并激活；漏注册会导致世界、渲染或 Tick 系统看不到组件。'
    '根组件层级' = 'RootComponent 是 Actor 变换根，AttachParent 和相对变换决定子组件局部姿态；修改层级时要明确使用相对还是世界变换。'
    'CreateDefaultSubobject' = 'CreateDefaultSubobject 在构造阶段建立可编辑的默认子对象模板；运行时 CreateComponent 是实例级动态对象，注册和销毁责任不同。'
    '运行时 CreateComponent' = '动态组件创建后设置所属 Actor，完成 RegisterComponent 并加入实例组件列表；需要复制或保存时还要单独配置相应标志。'
    '组件 Tick 依赖' = '用 TickFunction 的 AddPrerequisite 声明前置依赖，让引擎调度顺序稳定；不要依赖当前帧偶然的组件注册顺序。'
    'PrimaryComponentTick' = 'PrimaryComponentTick 控制组件是否 Tick、TickGroup 和运行时开关；先设置 bCanEverTick，再按需要启用并选择合适 TickGroup。'
    'WorldSubsystem' = 'WorldSubsystem 每个 UWorld 通常有一个实例，随 World 初始化和销毁；它适合关卡级服务，不适合保存跨关卡全局状态。'
    'GameInstanceSubsystem' = 'GameInstanceSubsystem 随 GameInstance 存活，适合跨关卡但属于当前游戏实例的服务；退出 GameInstance 时统一销毁。'
    'Subsystem 初始化' = 'Subsystem 的 Initialize/Deinitialize 应与宿主生命周期对齐；跨模块依赖要在 Build.cs 和模块加载阶段明确，不能在初始化时假设任意模块已可用。'
    'ChildActorComponent' = 'ChildActorComponent 可能在编辑器重建、运行时生成和销毁子 Actor；不要缓存过期指针，并把子 Actor 的所有权和重建时机当成动态的。'
    '组件模板' = '组件模板保存默认值，实例属性由模板初始化后可独立修改；区分模板对象和实例对象，避免把实例运行时状态写回默认值。'
    'Actor 销毁回调' = 'EndPlay 负责按结束原因清理运行时资源，OnDestroyed 表示销毁通知，析构函数只做 C++ 内存收尾；不要把引擎交互放进析构函数。'
    '单播 Delegate' = '单播 Delegate 只有一个绑定目标，Execute 前要确认绑定有效；绑定对象销毁或结束玩法时及时解绑，避免调用悬空成员函数。'
    '多播 Delegate' = '多播 Delegate 可通知多个订阅者，广播期间不要直接破坏正在遍历的订阅集合；通过引擎提供的解绑语义或延迟修改处理重入。'
    '动态 Delegate' = '动态 Delegate 走反射，可被 Blueprint 使用并支持序列化，但开销高于原生 Delegate；只有需要反射边界时才使用。'
    'AddUObject 与 AddRaw' = 'AddUObject 能感知 UObject 生命周期，AddRaw 不会自动检查裸指针，AddLambda 还要审查捕获对象；跨异步边界优先用可失效绑定或显式解绑。'
    'Delegate 解绑' = '在 EndPlay、销毁或拥有者变化时集中解绑，并保存绑定句柄；不要只依赖对象移动或析构顺序自动清理非 UObject 绑定。'
    'BlueprintNativeEvent' = 'C++ 提供函数声明和 _Implementation 默认实现，Blueprint 可覆盖；C++ 调用应走生成的函数入口，不能绕过反射直接调用错误的实现层。'
    'UINTERFACE' = 'UINTERFACE 是反射壳，真正的接口函数放在 IInterface 中并由 UObject 类实现；调用前用接口检查和 Cast，不能把 UObject 指针直接当接口指针。'
    '接口指针转换' = '用 Cast<IInterface> 或 Implements 检查 UObject 是否实现接口，再取得接口指针；始终校验对象有效性，避免 reinterpret_cast 破坏 UObject 布局。'
    'AsyncTask' = 'AsyncTask 只能把工作切到指定线程，UObject 和大多数引擎对象访问必须回到 GameThread；跨线程传递数据而不是直接捕获并操作 UObject。'
    '线程池任务' = '线程池任务要明确捕获对象的生命周期、取消标志和完成回调线程；任务结束前不能释放共享状态，回调也要检查对象是否仍有效。'
    'TFuture 与 TPromise' = 'TPromise 设置共享结果，TFuture 负责等待或取得结果；要定义只取一次还是共享读取，并为取消、超时和异常提供完成路径。'
    'Latent Action' = 'Latent Action 绑定 World 上下文并跨帧继续执行；必须处理世界销毁、取消和回调重复触发，不能把短生命周期对象裸捕获进去。'
    '异步加载回调' = '异步加载回调应保存软引用或句柄并在回调中重新校验对象有效性；加载失败、取消和宿主销毁都要有明确分支。'
    '取消异步任务' = '取消通常只阻止后续工作或回调，不代表已运行代码立即停止；用线程安全状态协调资源释放，并让已排队回调安全地早退。'
    'Actor 复制开关' = 'bReplicates 决定 Actor 是否进入网络复制，NetLoadOnClient 影响客户端关卡加载，其他网络标志还要结合角色和连接状态判断。'
    'ReplicatedUsing' = '属性初始同步或服务端变更到达客户端后可触发 OnRep；服务端本地写入不会自动调用客户端回调，初始同步和后续变更要分别验证。'
    'DOREPLIFETIME' = 'DOREPLIFETIME 把属性加入复制布局，条件复制通过 DOREPLIFETIME_CONDITION 等宏声明；成员变化必须保持反射和复制声明一致。'
    '条件复制' = 'COND_OwnerOnly、COND_SkipOwner 等条件依赖连接所有权和 Actor 角色；先确认谁是 owning connection，再判断该连接是否满足条件。'
    '服务器权威' = '客户端只提交输入或请求，服务器验证并修改权威状态，再通过复制回写；客户端预测可以改善手感，但不能替代服务端校验。'
    'NetMulticast RPC' = 'NetMulticast 通常只能由服务器发起，并只发送给相关客户端；它适合瞬时事件，不适合承载必须最终一致的持久状态。'
    'Server RPC' = 'Server RPC 要检查调用者是否拥有 Actor，并在服务端验证参数和权限；Reliable 只保证传输语义，不等于业务请求合法。'
    'Client RPC' = 'Client RPC 按 Actor 所属连接定位目标客户端；调用者不是有效拥有者或 Actor 不相关时，RPC 可能不会到达目标。'
    '可靠 RPC' = 'Reliable RPC 保证有序可靠送达但会占用带宽并产生积压；它不能替代状态复制，因为新加入或丢失中间事件的客户端仍需要当前状态。'
    '组件复制' = '组件要允许复制、由复制 Actor 持有并在正确时机注册；网络角色和组件生命周期不匹配时，属性不会按预期同步。'
    '子对象复制' = 'ReplicateSubobjects 需要稳定的子对象所有权和生命周期，并在复制函数中把子对象写入；同时评估每个子对象的带宽成本。'
    'Fast Array Serializer' = 'Fast Array Serializer 通过标记数组项和增量变化，只发送新增、修改和删除项；回调和序列化 traits 必须按约定实现。'
    'NetDeltaSerialize' = 'NetDeltaSerialize 用 traits 自定义增量序列化，必须正确报告是否写入变化并兼容版本；不能把本地容器布局直接当网络协议。'
    'FArchive 序列化' = 'FArchive 是通用归档接口，网络复制、SaveGame 和资产序列化有不同生命周期与版本契约；不要用一次归档实现替代所有协议。'
    'SaveGame 字段' = 'SaveGame 字段进入存档，Transient 字段通常跳过；对象引用要考虑路径、软引用和加载顺序，不能假设运行时地址可持久化。'
    'USaveGame 版本' = '存档应带显式版本号，读取时先判断版本再迁移到当前结构；迁移逻辑要可重复并为缺失字段提供默认值。'
    '重连恢复' = '复制只能重建当前可复制状态，客户端本地缓存和临时任务需要额外恢复协议；重连流程应以服务器快照或重新初始化为准。'
    'NetUpdateFrequency' = 'NetUpdateFrequency 决定属性更新检查频率，要与优先级、相关性和带宽预算一起调节；提高频率会增加带宽和服务器开销。'
    'Runtime 模块' = 'Runtime 模块只暴露运行时需要的公共 API，Build.cs 依赖和导出宏要与 Public 头文件一致，编辑器代码不能反向进入运行时。'
    'Editor 模块' = 'Editor 模块承载编辑器工具并隔离 UnrealEd 等依赖，运行时目标不应加载它；插件通常用 Runtime/Editor 双模块划分边界。'
    'Build.cs 公有依赖' = '头文件中出现的类型需要放入 PublicDependencyModuleNames；只在 cpp 使用的依赖放私有，避免把实现依赖扩散给所有包含者。'
    'Build.cs 私有依赖' = 'PrivateDependencyModuleNames 足够覆盖仅在 cpp 或私有头使用的模块；一旦公共头暴露其类型，就必须升级为公有依赖。'
    'UHT 模块依赖' = '反射类型所在模块必须声明生成代码需要的依赖，并保证公共头和生成代码可见；UHT 报错先查模块名、Public 依赖和 include。'
    '插件 LoadingPhase' = 'LoadingPhase 决定插件模块在引擎启动哪个阶段加载；依赖更早阶段模块时要匹配启动顺序，编辑器工具则避免在运行时阶段强行加载。'
    '第三方库接入' = 'Build.cs 应分别声明头文件路径、库文件和运行时 DLL，并按目标平台配置；打包时还要确认 DLL 被 staged 且 ABI 与编译器一致。'
    '模块 API 宏' = '模块 API 宏控制跨模块符号导出；只导出稳定的公共类型和函数，避免把私有实现、模板内部状态或第三方 ABI 直接暴露。'
}

$windowsAnswers = @{
    'CreateProcess' = 'CreateProcess 的命令行缓冲区必须可写，启动信息和环境块要使用正确的 Unicode 版本；继承句柄要显式筛选，父进程按责任关闭不再使用的句柄。'
    '进程和线程句柄' = '句柄是内核对象引用，访问权限决定可做的操作；等待不会转移所有权，成功创建后由拥有者在所有路径调用 CloseHandle 一次。'
    '句柄继承' = '句柄继承必须同时满足可继承属性和创建时的继承策略；更安全的做法是显式传入允许继承的句柄，并在子进程中确认结果后关闭副本。'
    'Job Object' = 'Job Object 把进程放进可管理的进程组，可限制 CPU、内存等资源并接收结束通知；句柄和关联策略由创建它的服务统一管理。'
    'WaitForSingleObject' = '返回 WAIT_OBJECT_0、WAIT_TIMEOUT 和 WAIT_FAILED 要分开处理；等待期间不要销毁对象或依赖未定义的消息泵行为，超时不是失败完成。'
    'TLS' = 'TLS 为每个线程保存独立槽位，分配索引后在线程上下文中读写；线程退出清理和 DLL 卸载顺序必须明确，不能让回调访问已卸载模块。'
    'CreateThread 与 _beginthreadex' = '_beginthreadex 会初始化 C 运行库线程状态，使用 CRT 的线程应优先它；入口参数和退出码由调用方约定，并在结束后关闭线程句柄。'
    '线程优先级' = '线程优先级只影响调度倾向，不保证实时性；过高优先级可能饿死普通线程，应结合等待、CPU 占用和 QoS 调整。'
    'APC' = '用户态 APC 只有在线程进入 alertable wait 时执行；取消流程要让线程可进入可警觉等待，并保证 APC 数据和回调代码在线程退出前仍有效。'
    '临界区' = 'CRITICAL_SECTION 需先初始化再使用，同一线程递归进入会增加递归计数；删除前必须确认没有线程持有或等待它。'
    '互斥体' = '命名 Mutex 可跨进程并受安全描述符约束，进程内锁只解决本进程同步；Windows Mutex 允许同线程递归，但异常退出会产生 abandoned 状态。'
    '信号量' = 'Semaphore 的计数代表可用资源数，ReleaseSemaphore 不能超过最大计数；等待失败或重复释放要回滚对应的资源记账。'
    '事件' = '手动重置事件唤醒后保持有信号，自动重置通常只释放一个等待者；状态更新必须和 SetEvent 配合，否则会丢失唤醒。'
    'SRWLock' = 'SRWLock 支持共享和独占模式但不支持递归，也不能随意升级或降级；必须用与获取模式匹配的释放函数。'
    '条件变量' = 'Windows 条件变量要和 CRITICAL_SECTION 或 SRWLOCK 配合，并在循环中检查谓词；虚假唤醒和竞争会使一次 if 判断不可靠。'
    'Interlocked' = 'Interlocked 提供原子读改写和平台规定的内存序，但不能自动解决 ABA；需要版本标记、锁或更高层并发结构保护复合状态。'
    'WaitOnAddress' = 'WaitOnAddress 比较内存当前值与调用者提供的旧值，值变化后再唤醒；它适合轻量等待，但仍需循环检查谓词并处理虚假唤醒。'
    'INIT_ONCE' = 'InitOnceExecuteOnce 保证初始化回调只成功执行一次；回调失败要返回失败，让后续调用有机会重试，而不是发布半初始化对象。'
    '死锁条件' = '死锁需要互斥、持有并等待、不可剥夺和循环等待同时成立；排查时画出线程与锁的等待图，破坏任一条件即可降低风险。'
    '锁顺序' = '多把锁按全局顺序获取并在异常路径保持同一顺序；需要反向顺序时拆分临界区或使用能同时获取多把锁的协议。'
    'TLS 清理' = '线程退出会触发 TLS 清理机制，但 DLL 回调受卸载顺序影响；清理代码不能依赖已经卸载的模块或仍在运行的线程。'
    '进程终止回调' = '正常退出通常执行 CRT 和 DLL 清理，TerminateProcess 不保证这些清理；资源必须由外部所有者和显式关闭路径负责。'
    'WSAStartup' = 'WSAStartup 与 WSACleanup 成对调用并带引用计数，版本协商失败要回滚已初始化状态；不要在线程间随意提前 Cleanup。'
    '阻塞与非阻塞 socket' = '阻塞调用会等待，非阻塞通常返回 WSAEWOULDBLOCK，重叠 I/O 通过 OVERLAPPED 和完成通知推进；三者的线程模型不能混用。'
    'bind、listen、accept' = 'bind 固定本地地址，listen 建立监听队列，accept 取出已完成连接；backlog 不是无限队列，失败要区分地址冲突、资源不足和暂时错误。'
    'connect 超时' = '非阻塞 connect 先等待可写或异常事件，再用 SO_ERROR 判断结果；超时后关闭该 socket，不能把未完成连接继续当作成功连接使用。'
    'TCP 字节流' = 'TCP 只保证有序字节流，不保留消息边界；应用层必须自定义定长、长度前缀或分隔符协议，并单独表达半关闭。'
    '套接字复用' = 'SO_REUSEADDR 等选项的语义与平台有关，不能把它当作“多个进程随便抢同一端口”；先明确监听地址、重启场景和独占策略。'
    'select 与 WSAPoll' = 'select 需要维护 fd 集合且有容量限制，WSAPoll 用数组表达事件；二者都适合小规模连接，连接数增长应考虑 IOCP。'
    'WSAEventSelect' = 'WSAEventSelect 把网络事件映射到事件对象并要求 socket 非阻塞；处理事件后按约定重置或重新查询，不能只依赖一次通知。'
    '部分 send' = 'send 只保证接受了部分字节时，应记录偏移并继续发送；发送缓冲区必须在所有异步操作完成前保持有效。'
    'recv 返回值' = '正数表示收到字节，0 表示对端有序关闭，SOCKET_ERROR 表示失败；非阻塞下还要识别 WSAEWOULDBLOCK，而不是立即断开。'
    'shutdown 半关闭' = 'shutdown 可以只关闭发送或接收方向，分别对应 FIN 语义；半关闭后仍要继续读取对端数据，并最终 closesocket 释放句柄。'
    'SO_KEEPALIVE' = 'Keepalive 是内核级探测，参数和触发时间受系统控制；应用层心跳能表达业务活性，二者应按故障检测目标组合。'
    'UDP 报文' = 'UDP 保留报文边界但不保证送达、顺序或去重；应用层需处理丢包、乱序、重试和接收缓冲区不足。'
    'IPv4 与 IPv6' = '双栈服务要明确 IPV6_V6ONLY、监听地址和 IPv4-mapped 地址策略；解析结果应逐个尝试，不能只取列表第一项。'
    'getaddrinfo' = 'getaddrinfo 用 hints 指定地址族、套接字类型和协议，遍历返回链表逐个尝试；失败时释放结果并区分解析失败与连接失败。'
    'Overlapped I/O' = 'OVERLAPPED、缓冲区和上下文必须活到 I/O 完成；完成端口或事件只报告完成，真正的字节数和错误码仍要读取完成结果。'
    'IOCP 完成键' = '完成键通常绑定连接或资源上下文，工作线程从完成包区分 I/O 类型并取得 OVERLAPPED；上下文释放必须晚于最后一个完成包。'
    'GetQueuedCompletionStatus' = '返回值要结合完成字节数、OVERLAPPED 和 GetLastError 判断；ERROR_OPERATION_ABORTED 常表示取消，退出哨兵应使用独立约定。'
    '多个 recv 请求' = '多个 recv 必须为每个请求分配独立缓冲区和 OVERLAPPED，并记录所有权；完成顺序不等于提交顺序，协议层要自行排序或拼接。'
    '取消套接字 I/O' = 'CancelIoEx、closesocket 与完成通知可能竞态，取消后仍要消费完成包并只释放一次上下文；不能用关闭句柄立刻证明回调已结束。'
    'TCP_NODELAY' = 'TCP_NODELAY 禁用 Nagle 以降低小包等待，但可能增加包数和带宽；应结合应用层批量发送和延迟目标测量。'
    'TLS 会话' = 'TLS 在 socket 字节流之上负责握手、加密和证书验证；把握手状态与 socket 生命周期分层，验证失败必须安全关闭并清理会话。'
    'LoadLibraryEx' = 'LoadLibraryEx 的搜索路径和标志决定加载哪个模块，成功后模块引用计数增加；应使用受控搜索路径并对句柄执行对称 FreeLibrary。'
    'GetProcAddress' = 'GetProcAddress 返回的地址必须匹配真实导出 ABI；名称修饰、序号和调用约定不一致都会导致错误调用或崩溃。'
    'DLLMain' = 'DllMain 运行在 loader lock 下，应只做最小初始化；不要在其中加载 DLL、创建复杂线程、调用可能再次触发加载器的 API。'
    '卸载 DLL' = 'FreeLibrary 前必须确认没有线程仍执行 DLL 代码或持有其函数指针；静态对象、线程回调和引用计数要在卸载前完成收尾。'
    'CreateFile 共享模式' = 'CreateFile 的访问权、共享模式、创建方式和安全属性共同决定能否打开及后续兼容性；读写共享策略要与所有协作者约定一致。'
    'DuplicateHandle' = 'DuplicateHandle 在源进程读取句柄并在目标进程创建副本；双方都要明确访问权限和各自 CloseHandle 责任，源句柄不会自动关闭。'
    'ReadFile 与 WriteFile' = '同步 I/O 返回完成状态，重叠 I/O 可能先返回 FALSE 并报告 ERROR_IO_PENDING；缓冲区和 OVERLAPPED 必须保持有效直到完成。'
    'FlushFileBuffers' = 'FlushFileBuffers 请求系统把文件缓冲刷新到设备链路，但不等于所有硬件都已持久化；应按数据可靠性需求控制调用频率。'
    'CreateFileMapping' = '映射对象的保护属性、最大大小和名称决定共享协议；命名冲突要检查 GetLastError，大小和权限必须由生产者消费者共同约定。'
    'MapViewOfFile' = '映射偏移必须满足系统分配粒度，视图权限不能超过映射保护；使用完先 UnmapViewOfFile，再关闭 mapping 句柄。'
    '跨进程映射' = '共享内存只共享字节，不提供同步和版本；要配套命名锁或事件、固定布局版本，并处理进程异常退出留下的半写入状态。'
    'UTF-16 与 UTF-8' = 'Windows 宽字符 API 通常使用 UTF-16，转换时按字符数和字节数分别计算并检查无效序列；不能把字节长度当作字符长度。'
    '命名对象 Unicode' = '命名内核对象使用 Unicode 名称和命名空间，权限由安全描述符决定；跨会话或服务交互时要避免名称冲突和权限误配。'
    'CloseHandle' = 'CloseHandle 不是幂等操作，伪句柄不能直接按普通句柄重复关闭；关闭后立刻清空变量并确保没有并发使用者。'
    '伪句柄' = 'GetCurrentProcess/GetCurrentThread 返回当前上下文的伪句柄，不能直接传给别的进程；跨边界使用前用 DuplicateHandle 转成真实句柄。'
}

$sourceByGroup = @{
    'gof' = '来源：InformIT 的 GoF《Design Patterns》章节资料（原书定义）'
    'ue5' = '来源：Epic Games Unreal Engine 5 官方 C++ 文档'
    'windows' = '来源：Microsoft Learn Win32/Winsock 文档；协议语义参考 IETF RFC Editor'
}

$raw = Get-Content -Raw -Encoding utf8 -LiteralPath $DataPath
$json = $raw -replace '^window\.CPP_INTERVIEW_QUESTIONS\s*=\s*','' -replace ';\s*$',''
$data = $json | ConvertFrom-Json
$missing = @()
$gofSeen = @{}

foreach ($q in @($data)) {
    $group = [string]$q.group
    if ($group -eq 'cpp') { continue }

    if ($group -eq 'gof' -and [string]$q.pattern -ne 'Cross-pattern') {
        $pattern = [string]$q.pattern
        if (-not $gofSeen.ContainsKey($pattern)) { $gofSeen[$pattern] = 0 }
        $variant = $gofSeen[$pattern]
        $gofSeen[$pattern]++
        $answers = $gofAnswers[$pattern]
        $answer = if ($null -ne $answers -and $variant -lt @($answers).Count) { [string]$answers[$variant] } else { $null }
    } elseif ($group -eq 'gof') {
        $answer = [string]$crossAnswers[[string]$q.id]
    } else {
        $topic = Get-Topic ([string]$q.title)
        $answer = if ($group -eq 'ue5') { [string]$ueAnswers[$topic] } else { [string]$windowsAnswers[$topic] }
    }

    if ([string]::IsNullOrWhiteSpace($answer)) {
        $missing += [string]$q.id
        continue
    }
    if ($q.PSObject.Properties.Name -contains 'refs') { $q.PSObject.Properties.Remove('refs') }
    if ($q.PSObject.Properties.Name -contains 'answer') {
        $q.answer = $answer
    } else {
        $q | Add-Member -NotePropertyName answer -NotePropertyValue $answer
    }
    if ($q.PSObject.Properties.Name -contains 'source') {
        $q.source = $sourceByGroup[$group]
    } else {
        $q | Add-Member -NotePropertyName source -NotePropertyValue $sourceByGroup[$group]
    }
}

if ($missing.Count -gt 0) { throw "Missing answers for ids: $($missing -join ', ')" }
$payload = $data | ConvertTo-Json -Depth 10
Set-Content -LiteralPath $DataPath -Encoding utf8 -Value ("window.CPP_INTERVIEW_QUESTIONS =" + [Environment]::NewLine + $payload + [Environment]::NewLine + ';')
Write-Output ("Answers added: " + (@($data | Where-Object group -ne 'cpp').Count))

