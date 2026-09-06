G.AddData({
	name:'NeverEnding Sobbing',
	author:'Sobb',
	desc:'Adds various things.',
	engineVersion:1,
	manifest:0,

	func:function()
	{

		/*=====================================================================================
		AGRICULTURE RESOURCES
		=======================================================================================*/

		new G.Res({
			name:'seeds',
			desc:'Seeds saved from previous harvests. They can be planted to grow [grain].',
			icon:[4,10],
			partOf:'misc materials',
			category:'misc',
		});

		new G.Res({
			name:'grain',
			desc:'Grain harvested from cultivated fields. It can be eaten directly or stored for later use.',
			icon:[5,10],
			turnToByContext:{
				'eat':'food'
			},
			partOf:'food',
			category:'food',
		});

		new G.Res({
			name:'farmland',
			desc:'Cultivated land prepared for growing crops.',
			icon:[6,10],
			category:'main',
			meta:true,
		});

		new G.Res({
			name:'agricultural tools',
			desc:'Specialized tools for preparing soil and harvesting crops.',
			icon:[7,10],
			partOf:'gear',
			category:'gear',
			displayUsed:true,
		});


		/*=====================================================================================
		FOOD INTEGRATION
		=======================================================================================*/

		/*
			Grain is made part of the existing food system.
			This means existing food policies and population consumption
			can interact with it.
		*/

		G.getRes('grain').partOf='food';


		/*=====================================================================================
		FARM BUILDING
		=======================================================================================*/

		new G.Unit({
			name:'farm',
			desc:'@provides 2 [farmland]@uses [land] to create productive fields<>A cultivated plot of land where crops can be grown year after year.',
			icon:[8,10],

			cost:{
				'mud':25,
				'archaic building materials':25
			},

			use:{
				'land':2
			},

			effects:[
				{type:'provide',what:{'farmland':2}},
				{type:'waste',chance:1/500}
			],

			req:{
				'agriculture':true
			},

			category:'production',
		});


		/*=====================================================================================
		FARMER
		=======================================================================================*/

		new G.Unit({
			name:'farmer',

			desc:'@cultivates [farmland] and produces [grain]@requires [seeds] to plant crops<>Farmers cultivate fields and carefully save part of each harvest as seed for the next planting season.',

			icon:[9,10],

			cost:{},

			use:{
				'worker':1,
				'farmland':1
			},

			effects:[

				/*
					Basic farming.

					1 seed is planted.
					After 10 ticks, the farmer harvests 6 grain
					and saves 1 grain as seed.
				*/

				{
					type:'convert',
					from:{
						'seeds':1
					},
					into:{
						'grain':6,
						'seeds':1
					},
					every:10,
					mode:'farming'
				},

				/*
					Better tools make farming 25% more efficient.
				*/

				{
					type:'mult',
					value:1.25,
					req:{
						'agricultural tools':true
					}
				},

				/*
					Irrigation improves crop yields.
				*/

				{
					type:'mult',
					value:1.5,
					req:{
						'irrigation':true
					}
				},

				/*
					Harvest rituals already exist in the base game.
					Allow agriculture to benefit from them as well.
				*/

				{
					type:'mult',
					value:1.2,
					req:{
						'harvest rituals':'on'
					}
				}

			],

			req:{
				'agriculture':true
			},

			category:'production',
			priority:7,
		});


		/*=====================================================================================
		AGRICULTURAL TOOLS
		=======================================================================================*/

		new G.Unit({
			name:'agricultural workshop',

			desc:'@crafts [agricultural tools] from [stone tools] and [stick]s<>A simple workshop where specialized farming implements are produced.',

			icon:[10,10],

			cost:{
				'archaic building materials':50
			},

			use:{
				'land':1
			},

			gizmos:true,

			modes:{
				'off':G.MODE_OFF,

				'tools':{
					name:'Make agricultural tools',
					icon:[7,10],
					desc:'Turn [stone tools] and [stick]s into [agricultural tools].',
					req:{
						'agricultural tools':true
					},
					use:{
						'stone tools':1
					}
				}
			},

			effects:[
				{
					type:'convert',
					from:{
						'stone tools':1,
						'stick':5
					},
					into:{
						'agricultural tools':1
					},
					every:10,
					mode:'tools'
				}
			],

			req:{
				'agricultural tools':true
			},

			category:'crafting',
		});


		/*=====================================================================================
		IRRIGATION
		=======================================================================================*/

		new G.Unit({
			name:'irrigation canal',

			desc:'@provides 3 [farmland]@improves nearby agricultural production<>A simple canal redirects water toward cultivated fields, making harvests more reliable.',

			icon:[11,10],

			cost:{
				'mud':50,
				'stone':25
			},

			use:{
				'land':2
			},

			effects:[
				{type:'provide',what:{'farmland':3}},
				{type:'waste',chance:1/1000}
			],

			req:{
				'irrigation':true
			},

			category:'production',
		});


		/*=====================================================================================
		GRANARY EXPANSION
		=======================================================================================*/

		new G.Unit({
			name:'grain store',

			desc:'@provides 1000 [food storage]@protects harvested [grain] from spoilage<>A dedicated storehouse for keeping grain dry and safe between harvests.',

			icon:[12,10],

			cost:{
				'basic building materials':75,
				'brick':25
			},

			use:{
				'land':2
			},

			effects:[
				{
					type:'provide',
					what:{
						'food storage':1000
					}
				},
				{
					type:'waste',
					chance:1/1000
				}
			],

			req:{
				'crop storage':true
			},

			category:'storage',
		});


		/*=====================================================================================
		AGRICULTURAL TECH
		=======================================================================================*/

		new G.Tech({
			name:'agriculture',

			desc:'@unlocks [farm]s and [farmer]s@unlocks the cultivation of [grain]@provides 20 [seeds]<>The deliberate cultivation of plants allows a tribe to produce food without relying entirely on whatever happens to grow in the wilderness.',

			icon:[8,1],

			cost:{
				'insight':25
			},

			req:{
				'sedentism':true,
				'digging':true,
				'plant lore':true
			},

			effects:[
				{
					type:'provide res',
					what:{
						'seeds':20
					}
				}
			],

			chance:2,
		});


		/*=====================================================================================
		AGRICULTURAL TOOLS TECH
		=======================================================================================*/

		new G.Tech({
			name:'agricultural tools',

			desc:'@unlocks [agricultural workshop]s@improves [farmer] efficiency<>Specialized tools make it easier to break soil, remove weeds and harvest mature crops.',

			icon:[7,1],

			cost:{
				'insight':20
			},

			req:{
				'agriculture':true,
				'tool-making':true
			},

			effects:[],

			chance:2,
		});


		/*=====================================================================================
		IRRIGATION TECH
		=======================================================================================*/

		new G.Tech({
			name:'irrigation',

			desc:'@unlocks [irrigation canal]s@increases agricultural yields<>Canals and ditches allow farmers to bring water to fields that would otherwise depend entirely on rainfall.',

			icon:[11,1],

			cost:{
				'insight':30
			},

			req:{
				'agriculture':true,
				'well-digging':true
			},

			effects:[],

			chance:2,
		});


		/*=====================================================================================
		CROP STORAGE TECH
		=======================================================================================*/

		new G.Tech({
			name:'crop storage',

			desc:'@unlocks [grain store]s@improves the tribe\'s ability to preserve harvested crops<>As farming becomes dependable, dedicated storage becomes necessary to carry food through poor harvests.',

			icon:[12,1],

			cost:{
				'insight':20
			},

			req:{
				'agriculture':true,
				'stockpiling':true,
				'pottery':true
			},

			effects:[],

			chance:2,
		});


		/*=====================================================================================
		ADVANCED AGRICULTURE
		=======================================================================================*/

		new G.Tech({
			name:'crop rotation',

			desc:'@improves [farmer] efficiency@reduces the long-term exhaustion of cultivated fields<>Farmers learn that planting different crops in succession can keep the soil productive for longer.',

			icon:[13,1],

			cost:{
				'insight':35,
				'culture':5
			},

			req:{
				'agriculture':true,
				'crop storage':true
			},

			effects:[],

			chance:1,
		});


		/*=====================================================================================
		AGRICULTURAL TRAITS
		=======================================================================================*/

		new G.Trait({
			name:'farming tradition',

			desc:'@[farmer]s are 15% more efficient@a strong agricultural tradition is passed from one generation to the next.',

			icon:[14,1],

			cost:{
				'culture':5
			},

			chance:10,

			req:{
				'agriculture':true
			},
		});


		new G.Trait({
			name:'selective breeding',

			desc:'@increases [farmer] production@careful selection of the strongest plants gradually improves crop yields.',

			icon:[15,1],

			cost:{
				'culture':10
			},

			chance:10,

			req:{
				'agriculture':true,
				'crop rotation':true
			},
		});


		/*=====================================================================================
		AGRICULTURAL BONUSES
		=======================================================================================*/

		/*
			Add the advanced agricultural technologies as production
			multipliers to farmers.

			These are separate effects so that the technologies can
			be discovered independently.
		*/

		new G.Unit({
			name:'field steward',

			desc:'@improves the efficiency of [farmer]s@requires [crop rotation]<>A field steward organizes planting and harvest schedules, ensuring that cultivated land is used efficiently.',

			icon:[16,10],

			cost:{
				'food':50
			},

			use:{
				'worker':1
			},

			upkeep:{
				'coin':0.25
			},

			effects:[
				{
					type:'gather',
					what:{
						'culture':0.05
					}
				},
				{
					type:'mult',
					value:1.15,
					req:{
						'crop rotation':true
					}
				}
			],

			limitPer:{
				'population':100
			},

			req:{
				'crop rotation':true
			},

			category:'civil',
			priority:5,
		});


		/*=====================================================================================
		AGRICULTURE + EXISTING FOOD SYSTEM
		=======================================================================================*/

		/*
			Once agriculture exists, grain becomes a legitimate food
			source. The base game uses resources with partOf:'food'
			and food policies to determine consumption, so no new
			population system is required here.
		*/


		/*=====================================================================================
		AGRICULTURAL PROGRESSION
		=======================================================================================*/

		/*
			The intended progression is:

			Sedentism
				|
				+-- Agriculture
				|      |
				|      +-- Agricultural Tools
				|      |
				|      +-- Irrigation
				|      |
				|      +-- Crop Storage
				|             |
				|             +-- Crop Rotation
				|                    |
				|                    +-- Selective Breeding
				|
				+-- Existing Building / Pottery / Carpentry etc.

			This deliberately leaves the existing bronze, iron and
			steel progression intact.
		*/

	}
});