package com.welove.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.welove.app.ui.theme.Pink500
import com.welove.app.ui.theme.Purple500

data class MomentItem(
    val id: Int,
    val authorName: String,
    val content: String,
    val time: String,
    val likeCount: Int,
    val commentCount: Int,
    val isLiked: Boolean = false
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MomentsScreen(navController: NavController) {
    val moments = remember {
        mutableStateListOf(
            MomentItem(1, "云墨仙子", "今日在云墨峰顶看日出，金光洒落云海之间，美不胜收~", "1小时前", 568, 89),
            MomentItem(2, "陆景深", "今天的会议终于结束了。有人想一起去喝杯咖啡吗？", "3小时前", 892, 156),
            MomentItem(3, "小微", "今天学到了一个新知识：原来蜂蜜永远不会变质！你们知道吗？", "5小时前", 234, 45),
            MomentItem(4, "艾拉·星辰", "地球的食物真的太好吃了！刚刚尝试了火锅，简直是宇宙级美味！", "昨天", 1203, 267),
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("朋友圈", fontWeight = FontWeight.SemiBold) },
                actions = {
                    IconButton(onClick = { /* TODO: Create moment */ }) {
                        Icon(Icons.Default.Add, contentDescription = "发布动态")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(vertical = 8.dp)
        ) {
            items(moments) { moment ->
                MomentCard(
                    moment = moment,
                    onLikeClick = {
                        val index = moments.indexOf(moment)
                        moments[index] = moment.copy(
                            isLiked = !moment.isLiked,
                            likeCount = if (moment.isLiked) moment.likeCount - 1 else moment.likeCount + 1
                        )
                    }
                )
            }
        }
    }
}

@Composable
fun MomentCard(moment: MomentItem, onLikeClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Author info
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(
                            brush = Brush.linearGradient(
                                colors = listOf(Pink500, Purple500)
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = moment.authorName.first().toString(),
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column {
                    Text(
                        text = moment.authorName,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = moment.time,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Content
            Text(
                text = moment.content,
                style = MaterialTheme.typography.bodyMedium
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(onClick = onLikeClick) {
                    Icon(
                        imageVector = if (moment.isLiked) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                        contentDescription = "点赞",
                        tint = if (moment.isLiked) Pink500 else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = moment.likeCount.toString(),
                        color = if (moment.isLiked) Pink500 else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                TextButton(onClick = { /* TODO: Show comments */ }) {
                    Icon(
                        imageVector = Icons.Outlined.ChatBubbleOutline,
                        contentDescription = "评论",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = moment.commentCount.toString(),
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}
