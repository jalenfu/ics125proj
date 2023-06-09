package com.ics125proj;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.app.usage.UsageEvents.Event;
import android.app.usage.UsageEvents;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.util.Log;

import android.graphics.drawable.Drawable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.util.Calendar;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class ScreenTimeModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private final String TAG = "ScreenTimeModule";

    private List<AppUsageInfo> smallInfoList;

    private class AppUsageInfo {
        Drawable appIcon;
        String appName, packageName;
        long timeInForeground;
        int launchCount;

        AppUsageInfo(String pName) {
            this.packageName = pName;
        }
    }

    public ScreenTimeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ScreenTimeModule";
    }

    private void getUsageStatistics(long start_time, long end_time) {
        UsageEvents.Event currentEvent;
        HashMap<String, AppUsageInfo> map = new HashMap<>();
        HashMap<String, List<UsageEvents.Event>> sameEvents = new HashMap<>();

        UsageStatsManager mUsageStatsManager = (UsageStatsManager) reactContext.getSystemService(Context.USAGE_STATS_SERVICE);

        if (mUsageStatsManager != null) {
            UsageEvents usageEvents = mUsageStatsManager.queryEvents(start_time, end_time);

            while (usageEvents.hasNextEvent()) {
                currentEvent = new UsageEvents.Event();
                usageEvents.getNextEvent(currentEvent);
                if (currentEvent.getEventType() == UsageEvents.Event.ACTIVITY_RESUMED ||
                        currentEvent.getEventType() == UsageEvents.Event.ACTIVITY_PAUSED) {
                    String key = currentEvent.getPackageName();
                    if (map.get(key) == null) {
                        map.put(key, new AppUsageInfo(key));
                        sameEvents.put(key, new ArrayList<UsageEvents.Event>());
                    }
                    sameEvents.get(key).add(currentEvent);
                }
            }

            for (Map.Entry<String, List<UsageEvents.Event>> entry : sameEvents.entrySet()) {
                int totalEvents = entry.getValue().size();
                if (totalEvents > 1) {
                    for (int i = 0; i < totalEvents - 1; i++) {
                        UsageEvents.Event E0 = entry.getValue().get(i);
                        UsageEvents.Event E1 = entry.getValue().get(i + 1);

                        if (E1.getEventType() == 1 || E0.getEventType() == 1) {
                            map.get(E1.getPackageName()).launchCount++;
                        }

                        if (E0.getEventType() == 1 && E1.getEventType() == 2) {
                            long diff = E1.getTimeStamp() - E0.getTimeStamp();
                            map.get(E0.getPackageName()).timeInForeground += diff;
                        }
                    }
                }

                if (entry.getValue().get(0).getEventType() == 2) {
                    long diff = entry.getValue().get(0).getTimeStamp() - start_time;
                    map.get(entry.getValue().get(0).getPackageName()).timeInForeground += diff;
                }

                if (entry.getValue().get(totalEvents - 1).getEventType() == 1) {
                    long diff = end_time - entry.getValue().get(totalEvents - 1).getTimeStamp();
                    map.get(entry.getValue().get(totalEvents - 1).getPackageName()).timeInForeground += diff;
                }
            }

            smallInfoList = new ArrayList<>(map.values());
        }
    }

    @ReactMethod
    public void getDailyScreenTime(Callback callback) {
        UsageStatsManager usageStatsManager = (UsageStatsManager) reactContext.getSystemService(Context.USAGE_STATS_SERVICE);
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        long startTime = calendar.getTimeInMillis();
        long endTime = System.currentTimeMillis();

        getUsageStatistics(startTime, endTime);

        long totalScreenTime = 0;

        for (AppUsageInfo appUsageInfo : smallInfoList) {
            totalScreenTime += appUsageInfo.timeInForeground;
        }

        long screenTimeMinutes = totalScreenTime / (60 * 1000);

        WritableMap resultMap = Arguments.createMap();
        resultMap.putDouble("screenTime", screenTimeMinutes);

        callback.invoke(resultMap);
    }

    @ReactMethod
    public void getPastWeekScreenTime(Callback callback) {
        UsageStatsManager usageStatsManager = (UsageStatsManager) reactContext.getSystemService(Context.USAGE_STATS_SERVICE);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -8);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        WritableArray screenTimeArray = Arguments.createArray();

        for (int i = 0; i < 7; i++) {
            calendar.add(Calendar.DAY_OF_YEAR, 1);

            long startTime = calendar.getTimeInMillis();
            long endTime = startTime + (24 * 60 * 60 * 1000);

            getUsageStatistics(startTime, endTime);

            long totalScreenTime = 0;

            for (AppUsageInfo appUsageInfo : smallInfoList) {
                totalScreenTime += appUsageInfo.timeInForeground;
            }

            long screenTimeMinutes = totalScreenTime / (60 * 1000);

            WritableMap screenTimeMap = Arguments.createMap();
            screenTimeMap.putDouble("screenTime", screenTimeMinutes);

            screenTimeArray.pushMap(screenTimeMap);
        }

        callback.invoke(screenTimeArray);
    }

    private boolean hasUsageStatsPermission() {
        AppOpsManager appOps = (AppOpsManager) reactContext.getSystemService(Context.APP_OPS_SERVICE);
        int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), reactContext.getPackageName());
        return (mode == AppOpsManager.MODE_ALLOWED);
    }

    private void requestUsageStatsPermission() {
        Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }

    @ReactMethod
    public void checkAndRequestUsageStatsPermission() {
        if (!hasUsageStatsPermission()) {
            requestUsageStatsPermission();
        }
    }
}
