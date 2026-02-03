package com.welove.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
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

data class CharacterItem(
    val id: Int,
    val name: String,
    val personality: String,
    val category: String,
    val isRPG: Boolean = false
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CharactersScreen(navController: NavController) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("全部") }

    val categories = listOf("全部", "内置", "RPG", "陶伴")

    val characters = remember {
        listOf(
            CharacterItem(1, "小微", "活泼", "内置"),
            CharacterItem(2, "智博", "专业", "内置"),
            CharacterItem(3, "暖心", "温柔", "内置"),
            CharacterItem(4, "云墨仙子", "温柔", "仙侠", true),
            CharacterItem(5, "陆景深", "霸道", "都市", true),
            CharacterItem(6, "凌霄子", "高冷", "仙侠", true),
            CharacterItem(7, "艾拉·星辰", "活泼", "星际", true),
            CharacterItem(8, "前男友·林昊", "温柔欺骗", "陶伴"),
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("角色广场", fontWeight = FontWeight.SemiBold) }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Search bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                placeholder = { Text("搜索角色...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                singleLine = true,
                shape = RoundedCornerShape(24.dp)
            )

            // Category tabs
            ScrollableTabRow(
                selectedTabIndex = categories.indexOf(selectedCategory),
                modifier = Modifier.fillMaxWidth(),
                edgePadding = 16.dp
            ) {
                categories.forEach { category ->
                    Tab(
                        selected = selectedCategory == category,
                        onClick = { selectedCategory = category },
                        text = { Text(category) }
                    )
                }
            }

            // Character grid
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(characters.filter {
                    (selectedCategory == "全部" ||
                     (selectedCategory == "内置" && it.category == "内置") ||
                     (selectedCategory == "RPG" && it.isRPG) ||
                     (selectedCategory == "陶伴" && it.category == "陶伴")) &&
                    it.name.contains(searchQuery, ignoreCase = true)
                }) { character ->
                    CharacterCard(character = character) {
                        // TODO: Navigate to character detail
                    }
                }
            }
        }
    }
}

@Composable
fun CharacterCard(character: CharacterItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Avatar
            Box(
                modifier = Modifier
                    .size(72.dp)
                    .clip(CircleShape)
                    .background(
                        brush = Brush.linearGradient(
                            colors = listOf(Pink500, Purple500)
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = character.name.first().toString(),
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.onPrimary
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = character.name,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(4.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                AssistChip(
                    onClick = { },
                    label = { Text(character.personality, style = MaterialTheme.typography.labelSmall) },
                    modifier = Modifier.height(24.dp)
                )
                if (character.isRPG) {
                    AssistChip(
                        onClick = { },
                        label = { Text("RPG", style = MaterialTheme.typography.labelSmall) },
                        modifier = Modifier.height(24.dp),
                        colors = AssistChipDefaults.assistChipColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    )
                }
            }
        }
    }
}
