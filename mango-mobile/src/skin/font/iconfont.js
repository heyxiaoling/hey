;(function(window) {

var svgSprite = '<svg>' +
  ''+
    '<symbol id="icon-back" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M320 512 380.63104 575.60064 380.63104 575.599616 643.36896 851.2 704 787.600384 441.263104 512 704 236.40064 643.36896 172.8 380.63104 448.400384 380.63104 448.400384Z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-bianji" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M519.715 36.54c-259.198 0-469.195 210.046-469.195 469.195 0 259.121 209.995 469.145 469.195 469.145 259.152 0 469.195-210.022 469.195-469.145 0-259.152-210.073-469.195-469.195-469.195zM426.206 521.308l212.125-209.188 73.123 75.397-209.235 212.66-76.011-78.875zM483.926 610.452l-115.502 49.152 44.612-118.894 70.891 69.746zM740.822 747.508h-0.048c0 6.343-5.2 11.538-11.538 11.538h-454.38c-6.413 0-11.538-5.2-11.538-11.538v-450.962c0-6.413 5.122-11.538 11.538-11.538h322.934l-47.276 50.22h-227.089c-5.251 0-9.561 4.385-9.561 9.69v354.334c0 5.301 4.308 9.611 9.561 9.611h357.119c5.301 0 9.662-4.308 9.662-9.611v-226.841l50.622-46.921v322.017zM771.73 329.85c-9.919 11.131-42.204 43.725-42.204 43.725l-76.617-76.288 37.638-37.613c0 0 17.219-16.386 39.516 0 22.29 16.234 41.618 37.613 41.618 37.613s9.994 21.405 0.048 32.566z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-add" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M462.268854 561.782823c-117.489878 0-232.744855 0-348.913645 0 0-33.165354 0-65.398476 0-99.0499 115.610064 0 231.119845 0 348.428597 0 0-117.219725 0-233.048777 0-349.579817 34.057677 0 66.312288 0 99.946316 0 0 116.196419 0 231.730759 0 348.633259 116.910687 0 232.458329 0 348.912621 0 0 33.598212 0 65.830311 0 99.481735-115.606994 0-231.118821 0-348.427574 0 0 117.218702 0 233.048777 0 349.579817-34.057677 0-66.313312 0-99.946316 0C462.268854 794.653545 462.268854 679.116135 462.268854 561.782823z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-back1" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M363.840919 472.978737C336.938714 497.358861 337.301807 537.486138 364.730379 561.486138L673.951902 832.05497C682.818816 839.813519 696.296418 838.915012 704.05497 830.048098 711.813519 821.181184 710.915012 807.703582 702.048098 799.94503L392.826577 529.376198C384.59578 522.174253 384.502227 511.835287 392.492414 504.59418L702.325747 223.807723C711.056111 215.895829 711.719614 202.404616 703.807723 193.674252 695.895829 184.943889 682.404617 184.280386 673.674253 192.192278L363.840919 472.978737Z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-less" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M509.927514 387.159081C517.168621 379.168894 527.507586 379.262447 534.709532 387.493244L805.278364 696.714765C813.036915 705.581679 826.514517 706.480186 835.381431 698.721636 844.248346 690.963085 845.146852 677.485483 837.388303 668.618569L566.819471 359.397045C542.819471 331.968474 502.692194 331.60538 478.31207 358.507586L197.525612 668.340919C189.61372 677.071283 190.277222 690.562496 199.007586 698.474389 207.737949 706.386281 221.229163 705.722778 229.141056 696.992414L509.927514 387.159081Z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-moreunfold" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M478.31207 644.159081C502.692194 671.061286 542.819471 670.698193 566.819471 643.269621L837.388303 334.048098C845.146852 325.181184 844.248346 311.703582 835.381431 303.94503 826.514517 296.186481 813.036915 297.084988 805.278364 305.951902L534.709532 615.173423C527.507586 623.40422 517.168621 623.497773 509.927514 615.507586L229.141056 305.674253C221.229163 296.943889 207.737949 296.280386 199.007586 304.192277 190.277222 312.104171 189.61372 325.595383 197.525612 334.325747L478.31207 644.159081Z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-more" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M642.174253 504.59418C650.164439 511.835287 650.070886 522.174253 641.84009 529.376198L332.618569 799.94503C323.751654 807.703582 322.853148 821.181184 330.611697 830.048098 338.370249 838.915012 351.847851 839.813519 360.714765 832.05497L669.936288 561.486138C697.36486 537.486138 697.727953 497.358861 670.825747 472.978737L360.992414 192.192278C352.26205 184.280386 338.770837 184.943889 330.858944 193.674252 322.947053 202.404616 323.610556 215.895829 332.340919 223.807723L642.174253 504.59418Z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-add1" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M853.333333 533.333333C865.115407 533.333333 874.666667 523.782074 874.666667 512 874.666667 500.217926 865.115407 490.666667 853.333333 490.666667L170.666667 490.666667C158.884592 490.666667 149.333333 500.217926 149.333333 512 149.333333 523.782074 158.884592 533.333333 170.666667 533.333333L853.333333 533.333333Z"  ></path>'+
      ''+
      '<path d="M490.666667 853.333333C490.666667 865.115407 500.217926 874.666667 512 874.666667 523.782074 874.666667 533.333333 865.115407 533.333333 853.333333L533.333333 170.666667C533.333333 158.884592 523.782074 149.333333 512 149.333333 500.217926 149.333333 490.666667 158.884592 490.666667 170.666667L490.666667 853.333333Z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-checkbox" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M512 72.064c242.688 0 439.936 197.376 439.936 439.936 0 242.624-197.248 440-439.936 440-242.624 0-439.936-197.376-439.936-440S269.312 72.064 512 72.064M512 32C246.912 32 32 246.912 32 512c0 265.024 214.912 480 480 480 265.024 0 480-214.976 480-480C992 246.912 777.024 32 512 32L512 32z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-naozhong3" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M643.197 567.606l-118.953-65.002v-212.846c0-12.153-4.948-22.284-17.36-22.284-12.501 0-17.36 9.976-17.36 22.284v222.186c0 13.393 15.837 25.372 19.406 27.41l114.861 61.639c10.589 6.046 21.35 4.101 27.557-6.531 6.25-10.707 2.568-20.736-8.15-26.857z"  ></path>'+
      ''+
      '<path d="M512 67.408c-248.27 0-449.532 199.050-449.532 444.592 0 245.54 201.262 444.592 449.532 444.592 248.268 0 449.532-199.051 449.532-444.592-0.001-245.541-201.264-444.592-449.532-444.592zM512 922.365c-223.443 0-414.811-189.379-414.811-410.365 0-220.988 191.368-410.365 414.811-410.365 223.442 0 414.811 189.377 414.811 410.365 0 220.986-191.37 410.365-414.811 410.365z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-arrow" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M777.638009 513.115404 356.593558 954.59835l-97.407494-106.615203 323.627748-339.329359L246.361991 178.26608 350.179474 69.40165 777.638009 513.115404z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-gouxuan" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M511.322571 63.620993c-246.971881 0-447.189925 200.206788-447.189925 447.184809s200.218044 447.184809 447.189925 447.184809c246.978021 0 447.189925-200.206788 447.189925-447.184809S758.300592 63.620993 511.322571 63.620993L511.322571 63.620993zM767.82041 394.804834 478.605426 684.031075l-0.011256 0.016373c-13.331633 13.331633-33.667797 15.410991-49.185212 6.249331-2.87856-1.699712-5.584182-3.790326-8.055466-6.249331-0.005117-0.005117-0.005117-0.005117-0.005117-0.005117L254.825756 517.519714c-15.796778-15.808034-15.796778-41.432645 0-57.245795 15.808034-15.808034 41.437761-15.808034 57.245795 0l137.90279 137.90279 260.611529-260.611529c15.802918-15.802918 41.437761-15.802918 57.240679 0C783.628444 353.378329 783.628444 379.001917 767.82041 394.804834L767.82041 394.804834zM767.82041 394.804834"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-forbid" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M501 110.328c-220.928 0-400.672 179.744-400.672 400.672s179.744 400.672 400.672 400.672 400.672-179.744 400.672-400.672S721.928 110.328 501 110.328zM501 871.672c-198.872 0-360.672-161.8-360.672-360.672s161.8-360.672 360.672-360.672 360.672 161.8 360.672 360.672S699.872 871.672 501 871.672z"  ></path>'+
      ''+
      '<path d="M739 491l-476 0c-11.048 0-20 8.952-20 20s8.952 20 20 20l476 0c11.048 0 20-8.952 20-20S750.048 491 739 491z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-check" viewBox="0 0 1280 1024">'+
      ''+
      '<path d="M383.802 364.4l-101.2 108.4 255.2 239.2 483.6-497.6-88.4-81.2-397.2 385.2z"  ></path>'+
      ''+
      '<path d="M162.601 32c-66.4 0-120 53.6-120 120v720c0 66.4 53.6 120 120 120h720c66.4 0 120-53.6 120-120v-455.2l-120 116.4v298.8c0 22-18 40-40 40h-640c-22 0-40-18-40-40v-640c0-22 18-40 40-40h505.2l107.6-117.6-652.8-2.4z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-yiwen" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M512 1024C229.229714 1024 0 794.770286 0 512 0 229.229714 229.229714 0 512 0 794.770286 0 1024 229.229714 1024 512 1024 794.770286 794.770286 1024 512 1024ZM512 73.142857C269.628952 73.142857 73.142857 269.628952 73.142857 512 73.142857 754.371048 269.628952 950.857143 512 950.857143 754.371048 950.857143 950.857143 754.371048 950.857143 512 950.857143 269.628952 754.371048 73.142857 512 73.142857ZM642.901333 501.49181C632.100571 512.463238 612.693333 530.944 584.704 556.934095 576.975238 564.248381 570.758095 570.684952 566.101333 576.24381 561.444571 581.778286 557.958095 586.849524 555.690667 591.457524 553.423238 596.065524 551.643429 600.673524 550.4 605.281524 549.156571 609.889524 547.279238 617.984 544.768 629.564952 540.452571 654.116571 526.896762 666.404571 504.149333 666.404571 492.324571 666.404571 482.352762 662.381714 474.282667 654.360381 466.212571 646.339048 462.165333 634.392381 462.165333 618.569143 462.165333 598.723048 465.115429 581.558857 471.04 567.02781 476.964571 552.496762 484.815238 539.745524 494.592 528.749714 504.368762 517.778286 517.583238 504.734476 534.186667 489.618286 548.742095 476.379429 559.274667 466.407619 565.76 459.678476 572.245333 452.949333 577.706667 445.44 582.144 437.174857 586.581333 428.909714 588.8 419.937524 588.8 410.258286 588.8 391.363048 582.022095 375.417905 568.490667 362.422857 554.959238 349.45219 537.478095 342.942476 516.096 342.942476 491.056762 342.942476 472.624762 349.500952 460.8 362.593524 448.975238 375.710476 438.954667 395.02019 430.762667 420.522667 423.033905 447.21981 408.356571 460.55619 386.730667 460.55619 373.979429 460.55619 363.227429 455.899429 354.474667 446.561524 345.721905 437.248 341.333333 427.129905 341.333333 416.280381 341.333333 393.825524 348.281905 371.102476 362.154667 348.086857 376.027429 325.046857 396.288 305.980952 422.912 290.864762 449.536 275.748571 480.597333 268.190476 516.096 268.190476 549.083429 268.190476 578.218667 274.505143 603.477333 287.134476 628.736 299.76381 648.240762 316.952381 662.016 338.70019 675.791238 360.423619 682.666667 384.048762 682.666667 409.551238 682.666667 429.616762 678.741333 447.21981 670.890667 462.336 663.04 477.45219 653.702095 490.496 642.901333 501.49181ZM507.904 698.63619C522.24 698.63619 534.308571 703.73181 544.085333 713.874286 553.862095 724.041143 558.762667 736.548571 558.762667 751.420952 558.762667 767.951238 553.642667 780.946286 543.402667 790.406095 533.162667 799.841524 521.337905 804.571429 507.904 804.571429 494.031238 804.571429 481.913905 799.914667 471.552 790.576762 461.190095 781.238857 456.021333 768.195048 456.021333 751.420952 456.021333 736.548571 461.019429 724.041143 471.04 713.874286 481.060571 703.73181 493.348571 698.63619 507.904 698.63619Z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-contact" viewBox="0 0 1025 1024">'+
      ''+
      '<path d="M992.156794 639.99379l-192.003105 0c-17.68515 0-31.992238-14.307088-31.992238-31.992238 0-17.68515 14.307088-31.992238 31.992238-31.992238l192.003105 0c17.68515 0 31.992238 14.307088 31.992238 31.992238C1024.149032 625.686703 1009.841944 639.99379 992.156794 639.99379zM992.156794 447.990685l-256.037258 0c-17.68515 0-31.992238-14.307088-31.992238-31.992238 0-17.635473 14.356765-31.992238 31.992238-31.992238l256.037258 0c17.68515 0 31.992238 14.356765 31.992238 31.992238C1024.149032 433.683598 1009.841944 447.990685 992.156794 447.990685zM992.156794 255.987581l-256.037258 0c-17.68515 0-31.992238-14.307088-31.992238-31.992238 0-17.68515 14.356765-31.992238 31.992238-31.992238l256.037258 0c17.68515 0 31.992238 14.307088 31.992238 31.992238C1024.149032 241.680493 1009.841944 255.987581 992.156794 255.987581zM704.127298 704.027944l0 127.968952c0 106.061223-85.991559 192.003105-192.003105 192.003105L192.052782 1024C85.991559 1024 0 938.058119 0 831.996895l0-127.968952c0-84.054141 54.39674-154.745064 129.608305-180.726338-40.983845-55.290933-65.574152-126.081211-65.574152-203.279872C64.034153 143.269587 192.996653 0 352.063649 0s288.029496 143.269587 288.029496 320.021734c0 77.198661-24.639984 147.988939-65.574152 203.279872C649.730558 549.28288 704.127298 619.924126 704.127298 704.027944zM576.108669 320.021734c0-141.381846-100.298646-255.987581-224.04502-255.987581s-224.04502 114.605734-224.04502 255.987581c0 141.381846 100.298646 255.987581 224.04502 255.987581S576.108669 461.40358 576.108669 320.021734zM640.093145 720.024062c0-68.058022-51.664484-124.690244-120.865085-139.79217-47.143841 37.456751-104.769611 59.761898-167.214088 59.761898s-120.02057-22.305147-167.214088-59.761898c-69.200602 15.052249-120.865085 71.734148-120.865085 139.79217l0 95.976714c0 79.533498 70.343181 144.014748 157.129578 144.014748l261.849512 0c86.786397 0 157.129578-64.48125 157.129578-144.014748L640.043468 720.024062zM800.104012 768.012419l192.003105 0c17.68515 0 31.992238 14.307088 31.992238 31.992238 0 17.68515-14.307088 31.992238-31.992238 31.992238l-192.003105 0c-17.68515 0-31.992238-14.307088-31.992238-31.992238C768.111774 782.319507 782.418862 768.012419 800.104012 768.012419z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-insinfo" viewBox="0 0 1025 1024">'+
      ''+
      '<path d="M512.542332 1024c-44.271962 0-88.951692-5.825258-132.990644-17.650532-272.622083-73.048738-435.088534-354.292203-361.981543-626.856033C90.618881 106.871352 371.862346-55.478594 644.542682 17.511891c132.058603 35.359317 242.447246 120.058571 310.835777 238.48607 68.388531 118.369246 86.563337 256.31136 51.145767 388.428216-12.291295 45.844782-31.281636 90.291502-56.505004 132.00035-7.339825 12.116537-23.068022 15.961207-35.126307 8.679635-12.116537-7.281573-16.01946-23.068022-8.679635-35.126307 22.718507-37.631168 39.844766-77.592439 50.912757-118.835267 31.864162-118.89352 15.495187-243.029771-46.01954-349.573744-61.514726-106.602225-160.893631-182.796602-279.728898-214.660764-245.359875-65.708912-498.525595 80.388563-564.29276 325.748438-65.767165 245.359875 80.388563 498.467343 325.80669 564.234508 122.330422 32.796204 249.554061 14.388388 358.369883-51.67004 12.116537-7.339825 27.844734-3.495155 35.184559 8.56313 7.339825 12.058284 3.495155 27.844734-8.56313 35.184559C696.037964 998.601874 604.989179 1024 512.542332 1024z"  ></path>'+
      ''+
      '<path d="M518.076327 767.805145c-2.03884 0.524273-4.077681 0.757284-6.233026 0.757284-14.155377-0.058253-25.514631-11.650516-25.398126-25.805894l0.174758-26.737935c0.116505-14.097125 11.650516-25.398126 25.747641-25.456378 14.097125 0.058253 25.514631 11.650516 25.456378 25.747641l-0.23301 26.796188C537.532689 755.106082 529.20257 765.125526 518.076327 767.805145z"  ></path>'+
      ''+
      '<path d="M483.299535 227.279438l51.204019 0 0 390.292298L483.299535 617.571737 483.299535 227.279438z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-toarrow" viewBox="0 0 3312 1024">'+
      ''+
      '<path d="M1167.207 605.359h969.559c18.458 0 33.439 14.98 33.439 33.439s-14.98 33.439-33.439 33.439h-969.559c-18.458 0-33.439-14.935-33.439-33.439s14.98-33.439 33.439-33.439z"  ></path>'+
      ''+
      '<path d="M1921.072 361.575l233.038 233.037c13.063 13.063 13.063 34.242 0 47.303s-34.242 13.062-47.303 0l-232.994-233.083c-13.063-13.063-13.063-34.242 0-47.258 13.063-13.063 34.195-13.063 47.257 0z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-time" viewBox="0 0 1025 1024">'+
      ''+
      '<path d="M512.420443 1024C229.401947 1024 0 794.798264 0 512.020021 0 229.241778 229.401947 0 512.420443 0s512.420443 229.241778 512.420443 512.020021C1024.880929 794.798264 795.43894 1024 512.420443 1024zM515.864075 58.741954c-248.982599 0-450.795448 201.652681-450.795448 450.435068s201.852892 450.435068 450.795448 450.435068 450.795448-201.652681 450.795448-450.435068S764.846674 58.741954 515.864075 58.741954zM678.315411 698.736949l-184.834943-164.813827c-6.687053-6.727095-9.490009-15.656513-9.049544-24.425762L484.430923 240.093223c0-17.138075 13.934697-31.03273 31.072772-31.03273l0.440465 0c17.178118 0 31.072772 13.894655 31.072772 31.03273l0 255.789778 176.546201 157.406014c12.493176 12.533219 12.493176 32.874673 0 45.447933C711.069957 711.270168 690.808587 711.270168 678.315411 698.736949z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-calendar" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M875.64754 1024 148.35246 1024C75.318379 1024 16.116991 964.862065 16.116991 891.891436L16.116991 198.226298c0-72.970628 59.201388-132.172016 132.235469-132.172016l132.235469 0L280.587929 33.058867C280.587929 14.784484 295.372413 0 313.646796 0S346.705664 14.784484 346.705664 33.058867l0 33.058867 330.588673 0L677.294336 33.058867C677.294336 14.784484 692.07882 0 710.353204 0c18.274383 0 33.058867 14.784484 33.058867 33.058867l0 33.058867 132.235469 0c73.034081 0 132.235469 59.137935 132.235469 132.172016l0 693.665138C1007.883009 964.862065 948.681621 1024 875.64754 1024zM941.765275 198.226298c0-36.485314-29.63242-66.054282-66.117735-66.054282l-132.235469 0 0 33.058867c0 18.210931-14.784484 33.058867-33.058867 33.058867-18.274383 0-33.058867-14.784484-33.058867-33.058867L677.294336 132.172016 346.705664 132.172016l0 33.058867c0 18.210931-14.784484 33.058867-33.058867 33.058867S280.587929 183.378362 280.587929 165.167431L280.587929 132.172016 148.35246 132.172016c-36.548767 0-66.117735 29.568968-66.117735 66.054282l0 66.054282 859.530549 0L941.765275 198.226298zM941.765275 330.334862 82.234725 330.334862l0 561.556575c0 36.485314 29.568968 66.117735 66.117735 66.117735l727.29508 0c36.485314 0 66.117735-29.568968 66.117735-66.117735L941.765275 330.334862zM809.529805 891.891436l-66.117735 0c-36.485314 0-66.117735-29.568968-66.117735-66.054282l0-66.054282c0-36.485314 29.63242-66.054282 66.117735-66.054282l66.117735 0c36.548767 0 66.117735 29.568968 66.117735 66.054282l0 66.054282C875.64754 862.322469 846.078572 891.891436 809.529805 891.891436zM809.529805 759.71942l-66.117735 0 0 66.054282 66.117735 0L809.529805 759.71942zM809.529805 627.610856l-66.117735 0c-36.485314 0-66.117735-29.568968-66.117735-66.054282L677.294336 495.502293c0-36.485314 29.63242-66.054282 66.117735-66.054282l66.117735 0c36.548767 0 66.117735 29.568968 66.117735 66.054282L875.64754 561.556575C875.64754 598.041889 846.078572 627.610856 809.529805 627.610856zM809.529805 495.502293l-66.117735 0L743.412071 561.556575l66.117735 0L809.529805 495.502293zM545.058867 891.891436 478.941133 891.891436c-36.485314 0-66.117735-29.568968-66.117735-66.054282l0-66.054282c0-36.485314 29.63242-66.054282 66.117735-66.054282l66.117735 0c36.548767 0 66.117735 29.568968 66.117735 66.054282l0 66.054282C611.176602 862.322469 581.607634 891.891436 545.058867 891.891436zM545.058867 759.71942 478.941133 759.71942l0 66.054282 66.117735 0L545.058867 759.71942zM545.058867 627.610856 478.941133 627.610856c-36.485314 0-66.117735-29.568968-66.117735-66.054282L412.823398 495.502293c0-36.485314 29.63242-66.054282 66.117735-66.054282l66.117735 0c36.548767 0 66.117735 29.568968 66.117735 66.054282L611.176602 561.556575C611.176602 598.041889 581.607634 627.610856 545.058867 627.610856zM545.058867 495.502293 478.941133 495.502293 478.941133 561.556575l66.117735 0L545.058867 495.502293zM280.587929 891.891436 214.470195 891.891436c-36.548767 0-66.117735-29.568968-66.117735-66.054282l0-66.054282c0-36.485314 29.568968-66.054282 66.117735-66.054282l66.117735 0c36.548767 0 66.117735 29.568968 66.117735 66.054282l0 66.054282C346.705664 862.322469 317.136696 891.891436 280.587929 891.891436zM280.587929 759.71942 214.470195 759.71942l0 66.054282 66.117735 0L280.587929 759.71942zM280.587929 627.610856 214.470195 627.610856c-36.548767 0-66.117735-29.568968-66.117735-66.054282L148.35246 495.502293c0-36.485314 29.568968-66.054282 66.117735-66.054282l66.117735 0c36.548767 0 66.117735 29.568968 66.117735 66.054282L346.705664 561.556575C346.705664 598.041889 317.136696 627.610856 280.587929 627.610856zM280.587929 495.502293 214.470195 495.502293 214.470195 561.556575l66.117735 0L280.587929 495.502293z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-filter" viewBox="0 0 1025 1024">'+
      ''+
      '<path d="M512.400407 1024C229.392977 1024 0 794.767185 0 512 0 229.232815 229.392977 0 512.400407 0s512.400407 229.232815 512.400407 512C1024.840854 794.767185 795.407836 1024 512.400407 1024zM515.843904 58.739657c-248.972863 0-450.777821 201.644795-450.777821 450.417455s201.844999 450.417455 450.777821 450.417455 450.777821-201.644795 450.777821-450.417455S764.816767 58.739657 515.843904 58.739657zM600.529913 896.470478l-184.50739-95.096582-6.406507-376.822711L218.14155 225.388911l545.03355-1.841871-161.844373 201.92508L600.529913 896.470478zM347.673105 274.358645 468.956284 400.406663l1.561586 349.675139 72.914053 41.762415 0.320325-387.073121 115.877688-132.935012L347.673105 274.358645z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-price" viewBox="0 0 1025 1024">'+
      ''+
      '<path d="M512.400407 1024C229.392977 1024 0 794.767185 0 512 0 229.232815 229.392977 0 512.400407 0s512.400407 229.232815 512.400407 512C1024.840854 794.767185 795.407836 1024 512.400407 1024zM515.843904 58.739657c-248.972863 0-450.777821 201.644795-450.777821 450.417455s201.844999 450.417455 450.777821 450.417455 450.777821-201.644795 450.777821-450.417455S764.816767 58.739657 515.843904 58.739657zM704.075076 468.996324l0 59.059983-166.208806 0-2.322359 2.362399 0 63.624619 168.491124 0 0 59.059983-168.491124 0 0 168.611246-59.140064 0 0-168.611246L307.712521 653.103308l0-59.059983 168.731368 0 0-64.065066-1.841871-1.921952L307.712521 528.056307l0-59.059983 109.591304 0L268.272464 315.280206l42.443106-41.081724 188.911864 194.797842 13.253461 0 188.871823-194.797842 42.483147 41.081724-149.071401 153.716118L704.075076 468.996324z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
'</svg>'
var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
var shouldInjectCss = script.getAttribute("data-injectcss")

/**
 * document ready
 */
var ready = function(fn){
  if(document.addEventListener){
      document.addEventListener("DOMContentLoaded",function(){
          document.removeEventListener("DOMContentLoaded",arguments.callee,false)
          fn()
      },false)
  }else if(document.attachEvent){
     IEContentLoaded (window, fn)
  }

  function IEContentLoaded (w, fn) {
      var d = w.document, done = false,
      // only fire once
      init = function () {
          if (!done) {
              done = true
              fn()
          }
      }
      // polling for no errors
      ;(function () {
          try {
              // throws errors until after ondocumentready
              d.documentElement.doScroll('left')
          } catch (e) {
              setTimeout(arguments.callee, 50)
              return
          }
          // no errors, fire

          init()
      })()
      // trying to always fire before onload
      d.onreadystatechange = function() {
          if (d.readyState == 'complete') {
              d.onreadystatechange = null
              init()
          }
      }
  }
}

/**
 * Insert el before target
 *
 * @param {Element} el
 * @param {Element} target
 */

var before = function (el, target) {
  target.parentNode.insertBefore(el, target)
}

/**
 * Prepend el to target
 *
 * @param {Element} el
 * @param {Element} target
 */

var prepend = function (el, target) {
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

function appendSvg(){
  var div,svg

  div = document.createElement('div')
  div.innerHTML = svgSprite
  svg = div.getElementsByTagName('svg')[0]
  if (svg) {
    svg.setAttribute('aria-hidden', 'true')
    svg.style.position = 'absolute'
    svg.style.width = 0
    svg.style.height = 0
    svg.style.overflow = 'hidden'
    prepend(svg,document.body)
  }
}

if(shouldInjectCss && !window.__iconfont__svg__cssinject__){
  window.__iconfont__svg__cssinject__ = true
  try{
    document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
  }catch(e){
    console && console.log(e)
  }
}

ready(appendSvg)


})(window)